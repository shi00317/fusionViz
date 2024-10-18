from setuptools import setup, find_packages

from python_coreml_stable_diffusion._version import __version__

with open('README.md') as f:
    readme = f.read()

setup(
    name='python_coreml_stable_diffusion',
    version=__version__,
    url='https://github.com/apple/ml-stable-diffusion',
    description="Run Stable Diffusion on Apple Silicon with Core ML (Python and Swift)",
    long_description=readme,
    long_description_content_type='text/markdown',
    author='Apple Inc.',
    install_requires=[
        "coremltools>=8.0",
        "diffusers[torch]==0.30.2",
        "torch",
        "transformers==4.44.2",
        "huggingface-hub==0.24.6",
        "scipy",
        "numpy<1.24",
        "pytest",
        "scikit-learn",
        "invisible-watermark",
        "safetensors",
        "matplotlib",
        "diffusionkit==0.4.0",
    ],
    packages=find_packages(),
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "Operating System :: MacOS :: MacOS X",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Topic :: Artificial Intelligence",
        "Topic :: Scientific/Engineering",
        "Topic :: Software Development",
    ],
)