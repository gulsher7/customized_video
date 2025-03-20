#import "RNVideoThumbnailView.h"
#import <React/RCTLog.h>

@interface RNVideoThumbnailView()

@property (nonatomic, strong) UIImageView *thumbnailImageView;
@property (nonatomic, strong) UILabel *timeLabel;
@property (nonatomic, strong) AVAsset *videoAsset;
@property (nonatomic, strong) AVAssetImageGenerator *imageGenerator;
@property (nonatomic, strong) NSCache *thumbnailCache;
@property (nonatomic, strong) NSOperationQueue *thumbnailOperationQueue;

@end

@implementation RNVideoThumbnailView

- (instancetype)init {
    self = [super init];
    if (self) {
        // Initialize the cache for thumbnails
        _thumbnailCache = [[NSCache alloc] init];
        _thumbnailCache.countLimit = 20; // Cache up to 20 thumbnails
        
        // Create background operation queue for thumbnail generation
        _thumbnailOperationQueue = [[NSOperationQueue alloc] init];
        _thumbnailOperationQueue.maxConcurrentOperationCount = 1;
        
        // Setup thumbnail container
        self.backgroundColor = [UIColor colorWithWhite:0.0 alpha:0.8];
        self.layer.cornerRadius = 8.0;
        self.layer.borderWidth = 1.0;
        self.layer.borderColor = [UIColor colorWithWhite:1.0 alpha:0.3].CGColor;
        self.clipsToBounds = YES;
        
        // Add thumbnail image view
        _thumbnailImageView = [[UIImageView alloc] init];
        _thumbnailImageView.contentMode = UIViewContentModeScaleAspectFit;
        _thumbnailImageView.layer.cornerRadius = 4.0;
        _thumbnailImageView.clipsToBounds = YES;
        [self addSubview:_thumbnailImageView];
        
        // Add time label
        _timeLabel = [[UILabel alloc] init];
        _timeLabel.textAlignment = NSTextAlignmentCenter;
        _timeLabel.textColor = [UIColor whiteColor];
        _timeLabel.font = [UIFont systemFontOfSize:12];
        [self addSubview:_timeLabel];
        
        // Default values
        _thumbnailWidth = 160;
        _thumbnailHeight = 100;
        _showThumbnail = NO;
        
        // Initially hidden
        self.hidden = YES;
    }
    return self;
}

- (void)layoutSubviews {
    [super layoutSubviews];
    
    // Layout thumbnail image view
    CGFloat padding = 4.0;
    _thumbnailImageView.frame = CGRectMake(padding, 
                                          padding, 
                                          self.bounds.size.width - (padding * 2), 
                                          self.bounds.size.height - 24 - (padding * 2));
    
    // Layout time label
    _timeLabel.frame = CGRectMake(0, 
                                 self.bounds.size.height - 20, 
                                 self.bounds.size.width, 
                                 16);
}

#pragma mark - Setters

- (void)setVideoURL:(NSString *)videoURL {
    if (_videoURL != videoURL) {
        _videoURL = videoURL;
        
        // Cancel any pending operations
        [_thumbnailOperationQueue cancelAllOperations];
        
        // Reset asset and image generator
        _videoAsset = nil;
        _imageGenerator = nil;
        
        // Setup new asset
        if (videoURL) {
            NSURL *url = [NSURL URLWithString:videoURL];
            _videoAsset = [AVAsset assetWithURL:url];
            
            // Setup image generator
            _imageGenerator = [AVAssetImageGenerator assetImageGeneratorWithAsset:_videoAsset];
            _imageGenerator.appliesPreferredTrackTransform = YES;
            _imageGenerator.maximumSize = CGSizeMake(_thumbnailWidth * 2, _thumbnailHeight * 2); // 2x for retina
            _imageGenerator.requestedTimeToleranceBefore = kCMTimeZero;
            _imageGenerator.requestedTimeToleranceAfter = kCMTimeZero;
        }
    }
}

- (void)setSeekTime:(float)seekTime {
    if (_seekTime != seekTime) {
        _seekTime = seekTime;
        
        if (_showThumbnail && _videoAsset) {
            [self generateThumbnailForTime:seekTime];
        }
    }
}

- (void)setShowThumbnail:(BOOL)showThumbnail {
    if (_showThumbnail != showThumbnail) {
        _showThumbnail = showThumbnail;
        self.hidden = !showThumbnail;
        
        if (showThumbnail && _videoAsset) {
            [self generateThumbnailForTime:_seekTime];
        }
    }
}

- (void)setThumbnailWidth:(float)thumbnailWidth {
    if (_thumbnailWidth != thumbnailWidth) {
        _thumbnailWidth = thumbnailWidth;
        
        // Update frame
        CGRect frame = self.frame;
        frame.size.width = thumbnailWidth;
        self.frame = frame;
        
        // Update image generator
        if (_imageGenerator) {
            _imageGenerator.maximumSize = CGSizeMake(_thumbnailWidth * 2, _thumbnailHeight * 2);
        }
    }
}

- (void)setThumbnailHeight:(float)thumbnailHeight {
    if (_thumbnailHeight != thumbnailHeight) {
        _thumbnailHeight = thumbnailHeight;
        
        // Update frame
        CGRect frame = self.frame;
        frame.size.height = thumbnailHeight;
        self.frame = frame;
        
        // Update image generator
        if (_imageGenerator) {
            _imageGenerator.maximumSize = CGSizeMake(_thumbnailWidth * 2, _thumbnailHeight * 2);
        }
    }
}

#pragma mark - Thumbnail Generation

- (void)generateThumbnailForTime:(float)timeInSeconds {
    if (!_videoAsset || !_imageGenerator) {
        return;
    }
    
    // Format time for display
    NSInteger minutes = (NSInteger)timeInSeconds / 60;
    NSInteger seconds = (NSInteger)timeInSeconds % 60;
    _timeLabel.text = [NSString stringWithFormat:@"%02ld:%02ld", (long)minutes, (long)seconds];
    
    // Check if thumbnail is in cache
    NSString *cacheKey = [NSString stringWithFormat:@"%@_%f", _videoURL, timeInSeconds];
    UIImage *cachedImage = [_thumbnailCache objectForKey:cacheKey];
    
    if (cachedImage) {
        _thumbnailImageView.image = cachedImage;
        
        if (_onThumbnailLoad) {
            _onThumbnailLoad(@{
                @"time": @(timeInSeconds),
                @"success": @YES
            });
        }
        return;
    }
    
    // Cancel any pending operations
    [_thumbnailOperationQueue cancelAllOperations];
    
    // Create a new operation for thumbnail generation
    __weak RNVideoThumbnailView *weakSelf = self;
    NSBlockOperation *operation = [NSBlockOperation blockOperationWithBlock:^{
        if (!weakSelf) return;
        
        RNVideoThumbnailView *strongSelf = weakSelf;
        CMTime time = CMTimeMakeWithSeconds(timeInSeconds, 600); // 600 gives good precision
        
        NSError *error = nil;
        CMTime actualTime;
        CGImageRef imageRef = [strongSelf.imageGenerator copyCGImageAtTime:time actualTime:&actualTime error:&error];
        
        if (!imageRef) {
            dispatch_async(dispatch_get_main_queue(), ^{
                if (strongSelf.onThumbnailLoad) {
                    strongSelf.onThumbnailLoad(@{
                        @"time": @(timeInSeconds),
                        @"success": @NO,
                        @"error": error ? error.localizedDescription : @"Failed to generate thumbnail"
                    });
                }
            });
            return;
        }
        
        UIImage *thumbnail = [UIImage imageWithCGImage:imageRef];
        CGImageRelease(imageRef);
        
        [strongSelf.thumbnailCache setObject:thumbnail forKey:cacheKey];
        
        // Update UI on main thread
        dispatch_async(dispatch_get_main_queue(), ^{
            if (weakSelf && [cacheKey isEqualToString:[NSString stringWithFormat:@"%@_%f", strongSelf.videoURL, strongSelf.seekTime]]) {
                strongSelf.thumbnailImageView.image = thumbnail;
                
                if (strongSelf.onThumbnailLoad) {
                    strongSelf.onThumbnailLoad(@{
                        @"time": @(timeInSeconds),
                        @"success": @YES
                    });
                }
            }
        });
    }];
    
    [_thumbnailOperationQueue addOperation:operation];
}

@end 