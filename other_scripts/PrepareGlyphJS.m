load('F:\FetalHeartManuscript\Figures\markers.mat');
classinfo = importdata('F:\FetalHeartManuscript\Figures\genesymbols.csv');

symbolnames = {'+' 'plus'
    'p' 'star5'
    'd' 'diamond'
    '>' 'triangleRight'
    'v' 'triangleDown'
    '*' 'asterisk'
    's' 'square'
    'h' 'star6'
    '.' 'point'
    'x' 'cross'
    '^' 'triangleUp'
    '<' 'triangleLeft'
    'o' 'circle'};
    

fid = fopen('..\dashboard\js\glyphAssignment.js', 'w');
fprintf(fid, '\nfunction glyphAssignment()\n{\n\tvar out = [\n');
for i = 1:length(legend_genes)
    fprintf(fid, '\t\t{gene: ''%s'',\ttaxonomy: ''%d'',\tglyphSymbol:''%s'',\tglyphName:''%s''},\n',...
        legend_genes{i},...
        classinfo.data(strcmp(classinfo.textdata, legend_genes{i})),...
        symbols{i,2},...
        symbolnames{strcmp(symbolnames(:,1),symbols{i,2}),2});
end
fprintf(fid, '\t\t];\n\treturn out\n}\n');

fclose(fid);