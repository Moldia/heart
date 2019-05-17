%% single cell mean
singlecell = importdata('..\SC_mtx_69genes_clusters_mean_190401.txt', '\t');
genes = singlecell.textdata(2:end);
genes(strcmp(genes, 'C8orf4')) = {'TCIM'};
classes = cellstr(num2str(singlecell.data(:,1)));
class_expression = [[{''}, classes']; [genes', num2cell(singlecell.data(:,2:end)')]];

figure; imagesc(singlecell.data(:,2:end));
set(gca,'XTick', 1:numel(genes), 'XTickLabel', genes, 'YTick', 1:numel(classes), 'YTickLabel', classes, 'XTickLabelRotation', 90);
% saveas(gcf, 'singlecell.png');

clusterinfo = importdata('..\clusters.csv');
clusterinfo = cellfun(@(v) strsplit(v, ','), clusterinfo, 'UniformOutput', 0);
clusterinfo = cat(1, clusterinfo{:});

%% remove erythrocytes and immune cells
remove = contains(clusterinfo(:,2), 'Erythrocyte') | contains(clusterinfo(:,2), 'Immune');
class_expression(:,find(remove)+1) = [];
classes = classes(~remove);
remove = contains(clusterinfo(:,2), 'Erythrocyte') | contains(clusterinfo(:,2), 'Immune');
clusterinfo = clusterinfo(~remove,:);

figure; imagesc(cell2mat(class_expression(2:end,2:end))');
set(gca,'XTick', 1:numel(genes), 'XTickLabel', genes, 'YTick', 1:length(clusterinfo), 'YTickLabel', class_expression(1,2:end), 'XTickLabelRotation', 90);
saveas(gcf, 'singlecell.png');

%% taglist
taglist = ID_list_ATCBtestseq;
taglist = cellfun(@(v) strsplit(v, ' '), taglist, 'uni', 0);
taglist = cat(1, taglist{:});
taglist = taglist(~strncmp(taglist(:,2), 'NN', 2),:);

%% construct iss class object
names = {'week4.5' 'week6.5' 'week9.5'};

for s = 1:3

    o = iss;

    [name, pos, parent] = getinsitudata(['..\..\' names{s} '\issSingleCell\ParentCell\QT_0.38_details_wCell.csv'], 2, 1, 8);
    [name, pos, parent] = removereads(name, 'NNNN', pos, parent);

    o.SpotGlobalYX = fliplr(pos);
    o.SpotScore = ones(length(name), 1);
    o.SpotCombi = repmat(5, length(name), 1);
    o.SpotIntensity = ones(length(name), 1);
    o.cAnchorIntensities = repmat(500, length(name), 5);

    [uNames, ~, iName] = unique(name);

    idx = cellfun(@(v) find(strcmp(v, taglist(:,2))), uNames);

    o.SpotCodeNo = iName;
    o.CharCodes = taglist(idx,1);
    o.GeneNames = uNames;

    o.BigDapiFile = ['..\..\' names{s} '\issSingleCell\base1_c1_ORG.tif'];

    o.plot
    
    dID = num2str(yyyymmdd(datetime));
    save(['o_heart_basecall_' names{s} '_' dID '.mat'], 'o', '-v7.3');
end


%% cell segmentation and cell calling
for s = 1:3
    load(['o_heart_basecall_' names{s} '_' dID '.mat']);
    celldata = importdata(['..\..\' names{s} '\issSingleCell\Stitched\ExpandedCells.csv']);
    [name, pos, parent] = getinsitudata(['..\..\' names{s} '\issSingleCell\ParentCell\QT_0.38_details_wCell.csv'], 2, 1, 8);
    [name, pos, parent] = removereads(name, 'NNNN', pos, parent);
    
    % renumber cells
    [original, idx] = sort(celldata.data(:,1));
    pmap = zeros(max(original), 1);
    pmap(original) = idx; 
    parent2 = parent;
    parent2(parent2~=0) = pmap(parent(parent~=0));

    background = imread(['..\..\' names{s} '\issSingleCell\Stitched\Outlines_100%.jpg']);

    o.CellCallRegionYX = [1 1; size(background, 1), size(background, 2)];
    o.CellMapFile = ['CellMap_' names{s} '.mat'];

    o.Graphics = 1;
    o.SpotReg = 0.001;
    o.CellCallShowCenter = [6000 8000];
    o.CellCallMaxIter = 200;

    o = call_cells_inputmean(o, class_expression, background, [{parent2}, {[idx, celldata.data(:,2:end)]}]);
%     pause()

    dID = num2str(yyyymmdd(datetime));
    save(['o_heart_cellcall_' names{s} '_' dID '.mat'], 'o', '-v7.3');
end

%% cell map
for s = 1:3
    load(['o_heart_cellcall_' names{s} '_' dID '.mat']);
    
    o.ClassCollapse = cell(length(clusterinfo), 3);
    o.ClassCollapse(:,1) = cellfun(@(v) strrep(v, 'Cluster ', ''), clusterinfo(:,1), 'UniformOutput', 0);
    o.ClassCollapse(:,2) = strcat({'('}, o.ClassCollapse(:,1), {') '}, clusterinfo(:,2));
    o.ClassCollapse(:,3) = cellfun(@hex2rgb, clusterinfo(:,3), 'UniformOutput', 0);
    o.ClassCollapse(:,1) = cellfun(@(v) {v}, classes, 'UniformOutput', 0);
    o.ClassCollapse = [o.ClassCollapse; [{{'Zero'}}, {'Uncalled'}, {[0 0 0]}]];
    
    o.PieSize = 12-s;
    save(['o_heart_cellcall_' names{s} '_' dID '.mat'], 'o', '-v7.3');
   
    pie_plot_heart(o);
    
    set(gca, 'YDir', 'reverse', 'XLim', [min(o.CellYX(:,1)), max(o.CellYX(:,1))+3000]);
    axis image
    ch = get(gca, 'children');
    for i = 1:numel(classes)+1
        ch(i).FontSize = 12;
        ch(i).FontWeight = 'bold';
    end
    axis off
    title(names{s}, 'FontSize', 18);
    
    set(gcf, 'inverthardcopy', 'off', 'Position', [1          41        1920        970],...
        'PaperPositionMode', 'manual', 'PaperOrientation', 'landscape', 'PaperUnits', 'normalized', 'PaperPosition', [0 0 1 1]);
    print(gcf, '-dpng', '-r600', ['heart_' names{s} '_' dID '.png']);

%     set(gcf, 'inverthardcopy', 'off', 'Position', [1          41        1920        1083],...
%         'PaperPositionMode', 'manual', 'PaperOrientation', 'portrait', 'PaperUnits', 'normalized', 'PaperPosition', [0 0 1 1]);
%     print(gcf, '-dpdf', '-r2000', ['heart_' names{s} '_' dID '.pdf']);
end

%% individual class
mkdir('individual');

for s = 1:3
    mkdir(['individual\' names{s}]);
    load(['CellMap_' names{s} '.mat'], 'IncludeSpot');
    load(['o_heart_cellcall_' names{s} '_' dID '.mat']);

    [maxprob, celltype] = max(o.pCellClass(1:end-1,:), [], 2);

    spotGeneName = o.GeneNames(o.SpotCodeNo);
    spotGeneName = spotGeneName(IncludeSpot);
    [uNames, ~, iName] = unique(spotGeneName);

    for i = 1:length(o.ClassCollapse)
        destination = ['individual\' names{s} '\' o.ClassCollapse{i}{1} '_' dID '.png'];    

        clf;
        subplot(121); hold on;
        j = find(strcmp(o.ClassNames, o.ClassCollapse{i}{1}));

        plot(o.CellYX(:,2), o.CellYX(:,1), '.', 'MarkerSize', 1);
        for k = find(celltype==j & maxprob>0.3)'
            plot(o.CellYX(k,2), o.CellYX(k,1), 'x', 'Color', o.ClassCollapse{i,3},...
                'LineWidth', 2, 'MarkerSize', 10*maxprob(k));
        end
        axis equal
        set(gca, 'YDir', 'reverse');
        title(o.ClassCollapse{i,2});

        try
            subplot(222); hist(maxprob(celltype==j & maxprob>0.3), 0:.05:1, .7)
            title('max probability distribution');

            subplot(224); hold on;
            temp = o.pSpotCell(:,celltype==j & maxprob>0.3);
            genePerCell = [];

            for k = 1:numel(uNames)
                if median(sum(temp(iName==k,:), 1)) > .3
                    genePerCell = [genePerCell; sum(temp(iName==k,:), 1)', repmat(k, nnz(celltype==j & maxprob>0.3), 1)];
                end
            end

            boxplot(genePerCell(:,1), genePerCell(:,2));
            set(gca, 'XTickLabel', uNames(unique(genePerCell(:,2))),...
                'XTickLabelRotation', 90);
            title('reads per cell distribution');
        end

        set(gcf, 'InvertHardcopy', 'off');
        saveas(gcf, destination);
    end
end

%% temporal comparison
mkdir('comparison')

for i = 1:length(o.ClassCollapse)
    destination = ['comparison\' o.ClassCollapse{i}{1} '_' dID '.png'];
    clf;
    
    for s = 1:3
        load(['CellMap_' names{s} '.mat'], 'IncludeSpot');
        load(['o_heart_cellcall_' names{s} '_' dID '.mat']);
        
        [maxprob, celltype] = max(o.pCellClass(1:end-1,:), [], 2);
        
        j = find(strcmp(o.ClassNames, o.ClassCollapse{i}{1}));
        
        subplot(1,3,s); hold on;
        plot(o.CellYX(:,2), o.CellYX(:,1), '.', 'MarkerSize', 1);
        for k = find(celltype==j & maxprob>0.3)'
            plot(o.CellYX(k,2), o.CellYX(k,1), 'x', 'Color', o.ClassCollapse{i,3},...
                'LineWidth', 2, 'MarkerSize', 10*maxprob(k));
        end
        axis equal
        axis off
        set(gca, 'YDir', 'reverse');
        title([names{s} ' ' o.ClassCollapse{i,2}]);
        
    end
    set(gcf, 'InvertHardcopy', 'off', 'Color', 'w');
    saveas(gcf, destination);
end
 

