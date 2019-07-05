function iss_diagnostics_heart(MyCell, o, ClassMeanExpression, CellMap, GeneNames, CellGeneCount, eGeneGamma, secondclass)
% iss_cell_diagnostics(MyCell, o, gSet, CellMap, GeneNames, CellGeneCount, eGeneGamma)


%%
ClassNames = vertcat(ClassMeanExpression(1,2:end)', {'Zero'});


nG = length(GeneNames);
nK = length(ClassNames); % last is zero-expression

% gene count
fprintf('-- Cell: %d Total Gene Count --\n', MyCell);
for gg=find(CellGeneCount(MyCell,:)>1e-3)
    fprintf('%s:\t%f\n', GeneNames{gg}, CellGeneCount(MyCell,gg));
end

% class posterior
fprintf('-- Class Posteriors --\n');
if nargin > 7
    for cc=find(o.pCellClass(MyCell,:)>1e-3 | strcmp(secondclass, ClassNames)')
        fprintf('%s:\t%e\n', ClassNames{cc}, o.pCellClass(MyCell,cc));
    end
else
    for cc=find(o.pCellClass(MyCell,:)>1e-3)
        fprintf('%s:\t%e\n', ClassNames{cc}, o.pCellClass(MyCell,cc));
    end
end
    
%% get info about cells
if size(CellMap, 2) > 2
    rp = regionprops(CellMap);
    CellYX = fliplr(vertcat(rp.Centroid)) + [y0 x0]; % convert XY to YX
    CellArea0 = vertcat(rp.Area); 

    SpotInCell = IndexArrayNan(CellMap, (SpotYX - [y0 x0])');
else
    SpotInCell = CellMap{1};
    CellYX = zeros(max(SpotInCell), 2);
    CellArea0 = zeros(max(SpotInCell), 1);
    CellYX(CellMap{2}(:,1),:) = fliplr(CellMap{2}(:,4:5));
    CellArea0(CellMap{2}(:,1)) = CellMap{2}(:,3);
end
MeanCellRadius = mean(sqrt(CellArea0/pi))*.5; % the dapi part is only half of the typical radius
RelCellRadius = [sqrt(CellArea0/pi)/MeanCellRadius; 1]; % but here we want the whole thing

% this is area factor relative to that of the average cell
CellAreaFactor = (exp(-RelCellRadius.^2/2)*(1-exp(o.InsideCellBonus)) + exp(o.InsideCellBonus)) ...
    / (exp(-1/2)*(1-exp(o.InsideCellBonus)) + exp(o.InsideCellBonus));

if contains(lower(ClassMeanExpression(end,1)), 'prior')
    ClassPrior = [.5*cell2mat(ClassMeanExpression(end, 2:end))/sum(cell2mat(ClassMeanExpression(end, 2:end))) .5];
    ClassMeanExpression = ClassMeanExpression(1:end-1,:);
else
    ClassPrior = [.5*ones(1,nK-1)/nK .5];
end


ClassDisplayNames = ClassNames;

% MeanClassExp = zeros(nK, nG);
% gSub = ClassMeanExpression.GeneSubset(GeneNames);
% for k=1:nK-1 % don't include last since it is zero-expression class
%     MeanClassExp(k,:) = o.Inefficiency * mean(gSub.ScaleCell(0).CellSubset(ClassNames{k}).GeneExp,2)';
% end

iGenes = cellfun(@(v) find(strcmp(v, ClassMeanExpression(:,1))), GeneNames);
MeanClassExp = cell2mat(ClassMeanExpression(iGenes, 2:end))';
% add zero cells
MeanClassExp = [MeanClassExp; zeros(1, numel(GeneNames))];

ScaledExp = reshape(MeanClassExp,[1 nK nG]) .* reshape(eGeneGamma,[1 1 nG]) .* CellAreaFactor   + o.SpotReg;

% pNegBin(nC, nK, nG): negbin parameter
pNegBin = ScaledExp ./ (o.rSpot + ScaledExp);

% heatmap: genes contribution to classes
figure(986543)
Myp = squeeze(pNegBin(MyCell,:,:)); % nK by nG
WeightMap = CellGeneCount(MyCell,:) .* log(Myp) +  o.rSpot*log(1-Myp);
imagesc(WeightMap);
set(gca, 'xtick', 1:nG); set(gca, 'XTickLabel', GeneNames); set(gca, 'XTickLabelRotation', 90);
set(gca, 'ytick', 1:nK); set(gca, 'yTickLabel', ClassNames);
title(sprintf('Cell %d: Contribution of genes to class scores', MyCell));

% barplot: gene efficiencies
figure(19043765)
bar(eGeneGamma);
set(gca, 'XTick', 1:nG), set(gca, 'XTickLabel', GeneNames);
set(gca, 'XTickLabelRotation', 90);
title('Gene efficiencies');
grid on

% barplot: comparison between top two classes
[~, TopClasses] = sort(o.pCellClass(MyCell,:), 'descend');
% TopClasses(1) = strmatch('Calb2.Cntnap5a.Rspo3', ClassNames);
% TopClasses(2) = strmatch('Cacna2d1.Lhx6.Reln', ClassNames);

if nargin > 7
    TopClasses(2) = strmatch(secondclass, ClassNames);
end
GeneContrib = WeightMap(TopClasses(1),:) -  WeightMap(TopClasses(2),:);
[sorted, order] = sort(GeneContrib);
figure (986544);
bar(sorted);
set(gca, 'XTick', 1:nG), set(gca, 'XTickLabel', GeneNames(order));
set(gca, 'XTickLabelRotation', 90);
title(sprintf('Cell %d: Score for class %s vs %s', MyCell, ClassNames{[TopClasses(1), TopClasses(2)]}));


end


