<img src="logo.png" alt="SOLEY Logo" width="300">

# SOLEY – Solar Cell Simulation Package

**SOLEY** is a scientific-grade simulation software for modelling the optical and electrical performance of photvoltaic solar cells.
It does not intend to replace existing packages which use the drift diffusion model, but rather to complement those by offering an alternative approach.

### 🟠 Optical Simulation Capabilities
- Transfer Matrix Method for multilayer optical calculations  
- Bruggeman effective medium approximation for composite layers (could sometimes be buggy as it messes the layer indexing)  
- Direct and diffuse illumination with angle and polarisation control (TE, TM, unpolarised)  
- Generation profile computation
- Parallel wavelength processing for faster simulations. Not always faster due to overheads unfortunately 🗿

### 🔵 Device Physics & Electrical Modelling
- Extended detailed balance framework  
- Multi-junction support (2T, 4T/6T configurations)  
- Recombination mechanisms: SRH, radiative, and Auger  
- Custom defect input: trap density, capture cross-sections, bulk and interface defects etc. The whole enchilada.  
- Series and shunt resistance effects
- Dynamic carrier injection variation (through a very innaccurate slider)
- Possibility to bypass the optical caluclation and use a step absorption, as in the SQ limit. If non radiative recombination are set to 0 and resistances are inexistent, you get the SQ limit.

### 🟢 Analysis & Visualisation
- J–V curve generation (dark and illuminated)  
- EQE calculations to come in a future update  
- Bandgap extraction from absorbance spectra, but always double check please!  
- Plotting of R, T, and internal absorption  
- Batch parameter sweeps and thickness optimisation

### 🟣 Data Handling & Export
- Export optical profiles, generation data, J–V curves...
- Save/load full simulation states as .soley files
- CSV export for external tools  

Future updates will add EQE (using thermodynamic equations, the goal is not to redo what SCAPS already does so well), other built-in recombination pathways, intermediate band solar cells, hot carrier solar cells etc. Just be patient with me pretty please.

## 🔽 Download

Executable versions are available for:

- [Windows (.exe)](https://zenodo.org/records/16887436/files/SOLEY-Windows_1.02.exe?download=1)
- [macOS](https://zenodo.org/records/16748821/files/SOLEY1.01-macOS?download=1)
- [Linux](https://zenodo.org/records/16748821/files/SOLEY1.01-Linux?download=1)

I don't have a Mac, but on some machine, it is possible that the GUI would not properly scale. I use tkinter for the GUI and it is a bit of a mystery to me, so apologies in advance if you encounter issues.
On a well-behaved screen/resolution, it should work. 

The SOLEY Manual is available here: [SOLEY Manual 1.01](https://zenodo.org/records/16748821/files/SOLEY_Manual.pdf?download=1) 
New functionalities may not appear directly in the manual, as I am sometimes a bit lazy 🗿. Apologies



👉 **[View full release on Zenodo](https://zenodo.org/records/16151991)**

## Installation

### Security Warning
Your OS will flag SOLEY as unsafe because it's unsigned. This is normal for independent software.

### Windows
1. Download `SOLEY_1.02.exe`
2. When Windows blocks it: click "More info" → "Run anyway"

### macOS
```bash
chmod +x SOLEY_1.01
./SOLEY_1.01
```
If blocked: System Preferences → Security & Privacy → Allow

### Linux
```bash
chmod +x SOLEY_1.01
./SOLEY_1.01
```

## 📖 How to Cite

Please cite the following article when using SOLEY in your work:

> Jehl Li-Kao, Z. "*SOLEY: a package for optical and extended detailed balance model for photovoltaic device simulation.*" *Solar RRL* (2025). DOI: [10.xxxx/solarrl.xxxxx](https://doi.org/10.xxxx/solarrl.xxxxx)

BibTeX:
```bibtex
@article{jehl2025soley,
  author = {Zacharie Jehl Li-Kao},
  title = {SOLEY: a package for optical and extended detailed balance model for photovoltaic device simulation},
  journal = {Solar RRL},
  year = {2025},
  doi = {10.xxxx/solarrl.xxxxx}
}
