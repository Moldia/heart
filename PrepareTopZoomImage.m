I = imread('D:\chenglin_HDCA_heart\issSingleCell\base1_c1_ORG.tif');
I = single(I);

% % zoom 8
% if size(I,2) > size(I,1)
%     I2 = imresize(I, [round(size(I,2)*65536/size(I,1)) 65536], 'bilinear');
% else
%     I2 = imresize(I, [65536 round(size(I,1)*65536/size(I,2))], 'bilinear');
% end
% 
% clear I
% I3 = uint8(I2/prctile(I2(:), 98)*255);
% 
% clear I2
% imwrite(I3, 'background_zoom8.tif', 'tiff');


% zoom 7
% I = imread('D:\CellTypingMenuscript\Data\AllSections\DAPI_20180318\background_image_161220KI_4-3_20180318.tif');
I = single(I);
if size(I,2) > size(I,1)
    I2 = imresize(I, [round(size(I,1)*16384/size(I,2)) 16384], 'bilinear');
else
    I2 = imresize(I, [16384 round(size(I,2)*16384/size(I,1))], 'bilinear');
end

clear I
I3 = uint8(I2/prctile(I2(:), 99)*255);

clear I2
imwrite(I3, 'D:\chenglin_HDCA_heart\images_for_viewer\week6_zoom7.tif', 'tiff');
