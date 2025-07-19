# SOLEY – Solar Cell Simulation Package

**SOLEY** is a scientific-grade simulation software for modelling the optical and electrical performance of photvoltaic solar cells.

### 🟠 Optical Simulation Capabilities
- Transfer Matrix Method for multilayer optical calculations  
- Bruggeman effective medium approximation for composite layers (could sometimes be buggy as it messes the layer indexing)  
- Direct and diffuse illumination with angle and polarisation control (TE, TM, unpolarised)  
- Generation profile computation
- Parallel wavelength processing for faster simulations. Not always faster due to overheads unfortunately 🥴

### 🔵 Device Physics & Electrical Modelling
- Extended detailed balance framework  
- Multi-junction support (2T, 4T/6T configurations)  
- Recombination mechanisms: SRH, radiative, and Auger  
- Custom defect input: trap density, capture cross-sections  
- Temperature-dependent modelling with activation energy  
- Series and shunt resistance effects

### 🟢 Analysis & Visualisation
- J–V curve generation (dark and illuminated)  
- EQE calculations to come in a future update  
- Bandgap extraction from absorbance spectra, but always double check please!  
- Real-time plotting of R, T, and internal absorption  
- Batch parameter sweeps and thickness optimisation

### 🟣 Data Handling & Export
- Export optical profiles, generation data, J–V curves, EQE  
- Save/load full simulation states  
- CSV export for external tools  
- Built-in \( n(\lambda), k(\lambda) \) optical constants database

Future updates will ad EQE (using thermodynamic equations, the goal is NOT to redo what SCAPS already does well), other bult-in recombination pathways, intermediate band solar cells, hot carrier solar cells etc. Just be patient with me please :)

## 🔽 Download

Executable versions are available for:

- [Windows (.exe)](https://zenodo.org/record/XXXXXX/files/SOLEY_Windows.exe)
- [macOS (.dmg)](https://zenodo.org/record/XXXXXX/files/SOLEY_macOS.dmg)
- [Linux (.AppImage)](https://zenodo.org/record/XXXXXX/files/SOLEY_Linux.AppImage)

👉 **[View full release on Zenodo](https://zenodo.org/record/XXXXXX)**

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
