function [NamesToShow, ColorsToShow] = pie_plot_heart(o)
% plot pie chart for each cell, showing probability of it belonging to all
% classes

nC = size(o.CellYX,1);
nK = size(o.pCellClass,2);

% find classes to collapse
CollapseMe = zeros(nK,1);
Colors = zeros(nK,3);
DisplayName = o.ClassNames;
for i=1:size(o.ClassCollapse,1)
    ClassList = o.ClassCollapse{i,1};
    for j=1:length(ClassList)
        MyClasses = strmatch(ClassList{j}, o.ClassNames);
        if length(MyClasses)==0;  continue; end
        CollapseMe(MyClasses)=i;
        Colors(MyClasses,:) = repmat(o.ClassCollapse{i,3},length(MyClasses),1);
        DisplayName(MyClasses) = o.ClassCollapse(i,2);
    end
end

% nColorWheel = sum(CollapseMe==0);
% 
% Colors0 = hsv(ceil(nColorWheel*1.2));
% Colors(~CollapseMe,:) = Colors0(1:nColorWheel,:); % last is zero
Colors(end,:) = [0 0 0];  % last is zero

figure(43908765)
% figure
clf; 
set(gcf, 'Color', 'w');
set(gca, 'color', 'w');
hold on


for c=1:nC
   
    pMy = o.pCellClass(c,:);
    
%     % sum up probabilities of merged classes
%     for j = 1:max(CollapseMe)
%         collapseThese = find(CollapseMe==j);
%         pMy(collapseThese(1)) = sum(pMy(CollapseMe==j));
%         pMy(collapseThese(2:end)) = 0;
%     end
    
    WorthShowing = find(pMy>o.MinPieProb);
    if ~isempty(WorthShowing)

        h = pie(pMy(WorthShowing), repmat({''}, 1, sum(WorthShowing>0)));

        for i=1:length(h)/2
            hno = (i*2-1);
            set(h(hno), 'FaceColor', Colors(WorthShowing(i),:));

            % size based on number of reads^2
            set(h(hno), 'Xdata', get(h(hno), 'Xdata')*o.PieSize*sqrt(sum(o.pSpotCell(:,c))) + o.CellYX(c,2));
            set(h(hno), 'Ydata', -(get(h(hno), 'Ydata'))*o.PieSize*sqrt(sum(o.pSpotCell(:,c))) + o.CellYX(c,1));            
            
%             set(h(hno), 'EdgeAlpha', 0);
            set(h(hno), 'EdgeAlpha', 0, 'LineWidth', .1, 'EdgeColor', [.5 .5 .5]);
        end
    end
    
    if mod(c,2000)==0
        drawnow
    end
end

yMax = max(o.CellYX(:,1));
xMax = max(o.CellYX(:,2));
yMin = min(o.CellYX(:,1));
xMin = min(o.CellYX(:,2));

ClassShown = find(any(o.pCellClass>o.MinPieProb,1));
ClassDisplayNameShown = DisplayName(ClassShown);
[uDisplayNames, idx] = unique(ClassDisplayNameShown, 'stable');
nShown = length(uDisplayNames);

legend_order = [1:numel(idx)]';

NamesToShow = DisplayName(ClassShown(idx));
ColorsToShow = Colors(ClassShown(idx(legend_order)),:);
for k=1:nShown
    h = text(xMax+200, yMin + k*(yMax-yMin)/nShown, NamesToShow{k}, 'fontsize', 8);
    set(h, 'color',ColorsToShow(k,:));
end

