#import <UIKit/UIKit.h>
#import <React/RCTComponent.h>
#import <AVFoundation/AVFoundation.h>

@interface RNVideoThumbnailView : UIView

@property (nonatomic, strong) NSString *videoURL;
@property (nonatomic, assign) float seekTime;
@property (nonatomic, assign) BOOL showThumbnail;
@property (nonatomic, assign) float thumbnailWidth;
@property (nonatomic, assign) float thumbnailHeight;
@property (nonatomic, copy) RCTDirectEventBlock onThumbnailLoad;

- (void)generateThumbnailForTime:(float)timeInSeconds;

@end 