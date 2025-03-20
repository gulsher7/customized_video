#import "RNVideoThumbnailManager.h"
#import "RNVideoThumbnailView.h"
#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>

@implementation RNVideoThumbnailManager

RCT_EXPORT_MODULE(RNVideoThumbnail)

- (UIView *)view
{
  return [[RNVideoThumbnailView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(videoURL, NSString)
RCT_EXPORT_VIEW_PROPERTY(seekTime, float)
RCT_EXPORT_VIEW_PROPERTY(showThumbnail, BOOL)
RCT_EXPORT_VIEW_PROPERTY(thumbnailWidth, float)
RCT_EXPORT_VIEW_PROPERTY(thumbnailHeight, float)
RCT_EXPORT_VIEW_PROPERTY(onThumbnailLoad, RCTDirectEventBlock)

@end 