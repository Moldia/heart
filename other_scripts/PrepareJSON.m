names = {'week4.5' 'week6.5' 'week9.5'};

for s = 1:3

    load(['o_heart_cellcall_' names{s} '_20190517.mat']);

    mkdir(fullfile('viewer', names{s}));
    
    
    %% iss.json
    fid = fopen(['viewer\' names{s} '\iss.json'], 'w');
    
    fprintf(fid, '[');
    for n = 1:length(o.CellYX)
        fprintf(fid, '{"Cell_Num":%d,"Y":%f,"X":%f,', n, o.CellYX(n,1), o.CellYX(n,2));
        children = find(full(o.pSpotCell(:,n)) > 0.001);
        if length(children)
            genes = o.GeneNames(o.SpotCodeNo(children));
            [uGenes, ~, iGene] = unique(genes);
            
            fmt = lineformat('"%s"', length(uGenes));
            fprintf(fid, ['"Genenames":[' strrep(fmt, '\n', '],')], uGenes{:});
            
            fmt = lineformat('%f', length(uGenes));
            fprintf(fid, ['"CellGeneCount":[' strrep(fmt, '\n', '],')], grpstats(full(o.pSpotCell(children,n)), iGene, 'sum'));
        else
            fprintf(fid, '"Genenames":[],"CellGeneCount":[],');
        end
        
        celltype = o.pCellClass(n,:);
        if nnz(celltype>0.001)
            fmt = lineformat('"%s"', nnz(celltype > 0.001));
            fprintf(fid, ['"ClassName":[' strrep(fmt, '\n', '],')], o.ClassNames{celltype > 0.001});
            fmt = lineformat('%f', nnz(celltype > 0.001));
            fprintf(fid, ['"Prob":[' strrep(fmt, '\n', ']}')], celltype(celltype> 0.001));
        else
            fprintf(fid, '"ClassName":[],"Prob":[],');
        end
        
        if n < length(o.CellYX)
            fprintf(fid, ',');
        else
            fprintf(fid, ']');
        end
    end
    fclose(fid);
    
    
    %% dapi_overlays.json
    fid = fopen(['viewer\' names{s} '\Dapi_overlays.json'], 'w');
    fprintf(fid, '[');
    
    % TAKE EVERY mth read
    if s == 1
        m = 1;
    elseif s == 2
        m = 10;
    else
        m = 20; 
    end
        
    for n = 1:m:length(o.SpotCodeNo)
        fprintf(fid, '{"Gene":"%s","Expt":%d,"y":%f,"x":%f,', o.GeneNames{o.SpotCodeNo(n)}, o.SpotCodeNo(n), o.SpotGlobalYX(n,1), o.SpotGlobalYX(n,2));
        
        pSpotCell = full(o.pSpotCell(n,1:end-1));
        [p, parent] = sort(pSpotCell, 'descend');
        if pSpotCell(parent(1)) > 0.05
            
            fprintf(fid, '"neighbour":%d,', parent(1));
            
            fprintf(fid, '"neighbour_array":[%d],', parent(1));
            fprintf(fid, '"neighbour_prob":[%f]}', p(1));
            
%             fmt = lineformat('%d', nnz(p>0.001));
%             fprintf(fid, ['"neighbour_array":[' strrep(fmt, '\n', '],')], parent(1:nnz(p>0.001)));
%             fmt = lineformat('%f', nnz(p>0.001));
%             fprintf(fid, ['"neighbour_prob":[' strrep(fmt, '\n', ']}')], p(1:nnz(p>0.001)));
        else
            fprintf(fid, '"neighbour":null,"neighbour_array":null,"neighbour_prob":null}');
        end
        
        if n < length(o.SpotCodeNo)
            fprintf(fid, ',');
        else
            fprintf(fid, ']');
        end
    end
    fclose(fid);
end
    
    