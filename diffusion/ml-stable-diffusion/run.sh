#!bin/bash/

python -m python_coreml_stable_diffusion.pipeline \
    --prompt "a photo of an combination starbuck logo with University of Minnesota Big M logo" \
    -i model/coreml-stable-diffusion-2-1-base-palettized/original/packages \
    --model-version stabilityai/stable-diffusion-2-1-base -o results/ \
    --num-inference-steps 75 --guidance-scale 15.0 \
    --compute-unit CPU_AND_GPU \
    --seed 93
