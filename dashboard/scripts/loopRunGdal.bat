
for %%f in (*.tif) do (
    echo %%~nf.tif
    gdal_translate -ot Byte -scale -r cubic -outsize 16384 0 %%~nf.tif "OUT_%%~nf.tif"
    python C:\OSGeo4W64\bin\gdal2tilesG.py -p raster -z 0-7 -w none "OUT_%%~nf.tif"
)

PAUSE
