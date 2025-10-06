<div align="center">

<img src="logo.png" alt="SOLEY Logo" width="400">

# SOLEY
### Solar Cell Simulation Package

**A scientific-grade toolkit for optical and electrical modeling of photovoltaic devices**

[![DOI](https://img.shields.io/badge/DOI-10.1002%2Fsolr.202500345-blue)](https://doi.org/10.1002/solr.202500345)
[![Zenodo](https://img.shields.io/badge/Zenodo-v1.3-orange)](https://zenodo.org/records/17144667)
[![License](https://img.shields.io/badge/License-Academic%20Use-green)](#license)

[**Download**](#-download) • [**Documentation**](https://github.com/zacharie-li-kao/SOLEY-PV/blob/main/SOLEY_Manual_1.3.pdf) • [**Cite**](#-citation) • [**Contact**](#-contact)

---

</div>

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
  - [Optical Simulation](#-optical-simulation-capabilities)
  - [Device Physics](#-device-physics--electrical-modeling)
  - [Analysis Tools](#-analysis--visualization-tools)
  - [Data Management](#-data-handling--export)
- [Download](#-download)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Technical Approach](#-technical-approach)
- [Roadmap](#-roadmap)
- [Citation](#-citation)
- [License](#-license)
- [Contact](#-contact)

---

## 🔬 Overview

**SOLEY** is a comprehensive simulation platform designed for researchers and engineers working on photovoltaic device optimization. Unlike traditional drift-diffusion simulators, SOLEY implements an **extended detailed balance framework** combined with rigorous **Transfer Matrix Method (TMM)** optical calculations, offering a complementary approach to existing tools like SCAPS-1D or PC1D.

### Why SOLEY?

- **Thermodynamically consistent**: Built on detailed balance principles for physically meaningful results
- **Multi-junction ready**: Native support for tandem and multi-terminal configurations
- **Flexible defect modeling**: Microscopic-to-macroscopic parameter translation using Scaffidi formulation
- **Fast optical engine**: Parallel TMM calculations with generation profile export
- **No drift-diffusion overhead**: Ideal for quick parameter screening and design space exploration

---

## ✨ Key Features

### 🟠 Optical Simulation Capabilities

<details>
<summary><b>Transfer Matrix Method (TMM) Engine</b></summary>

- **Rigorous electromagnetic modeling** of multilayer thin-film stacks
- Calculation of reflectance (R), transmittance (T), and layer-by-layer absorptance (A)
- **Field distribution computation** for spatially-resolved generation profiles
- Support for **complex refractive index** data (n + ik)
- Wavelength range: 250–4000 nm (user-configurable)

</details>

<details>
<summary><b>Advanced Illumination Options</b></summary>

- **Direct (collimated) light** with variable incidence angle (0–89°)
- **Diffuse (hemispherical) illumination** with Lambertian weighting
- **Polarization control**: TE, TM, or unpolarized
- Custom spectral input (AM1.5G, indoor spectra, monochromatic, etc.)
- **Dynamic injection control** via logarithmic power slider

</details>

<details>
<summary><b>Material Handling</b></summary>

- **Bruggeman effective medium approximation** for composite/mixed layers
- Real-time bandgap extraction from absorption spectra
- Support for arbitrary material combinations
- Built-in smoothing algorithms for noisy optical data

</details>

<details>
<summary><b>Generation Profile Calculations</b></summary>

- **Spatially-resolved photogeneration** G(x, λ) in each layer
- Export to CSV for external device simulators (SCAPS, Sentaurus, etc.)
- Multiprocessing acceleration for large spectral datasets
- Wavelength subsampling for rapid prototyping

</details>

### 🔵 Device Physics & Electrical Modeling

<details>
<summary><b>Extended Detailed Balance Framework</b></summary>

- **Shockley-Queisser limit** calculations with step-function absorption
- **Full recombination physics**:
  - Radiative recombination (Van Roosbroeck-Shockley)
  - SRH (Shockley-Read-Hall) with Scaffidi prefactor formulation
  - Auger recombination with temperature and bandgap dependence
- Integration with TMM-calculated absorption spectra
- **Thermodynamically consistent** Voc and FF predictions

</details>

<details>
<summary><b>Multi-Junction Support</b></summary>

- **2-terminal (2T) tandem** performance calculations
- Current-matching analysis for series-connected subcells
- **4-terminal (4T) mechanically-stacked** efficiency summation
- Support for 3-, 4-, 5-, and 6-junction devices
- Automatic limiting-subcell identification

</details>

<details>
<summary><b>Defect & Recombination Modeling</b></summary>

- **Microscopic parameter input**:
  - Trap density (Nt), capture cross-sections (σn, σp)
  - Effective masses, density of states (Nc, Nv)
  - Built-in potential (Vbi), doping concentration
- **Automatic J₀ calculation** from bulk and interface contributions
- **Activation energy (Ea)** and ideality factor (n) specification
- Per-absorber defect parameter storage

</details>

<details>
<summary><b>Resistance Effects</b></summary>

- Series resistance (Rs) in Ω·cm²
- Shunt resistance (Rsh) in Ω·cm²
- Implicit J-V solution accounting for voltage drops
- Realistic fill factor predictions

</details>

### 🟢 Analysis & Visualization Tools

<details>
<summary><b>Current-Voltage (J-V) Characteristics</b></summary>

- **Dark J-V curves** (thermal generation only)
- **Illuminated J-V curves** under custom spectra
- Interactive voltage sweep with user-defined range
- Overlay multiple absorbers for comparison
- Export to CSV for external plotting

</details>

<details>
<summary><b>External Quantum Efficiency (EQE)</b></summary>

- **Thermodynamic EQE model** using Green's function approach
- Automatic mapping of J₀ values to lifetimes and surface recombination velocities
- Integration with TMM field calculations
- Export spectral EQE data

> *Note: Full drift-diffusion EQE will be added in future versions*

</details>

<details>
<summary><b>Performance Metrics Dashboard</b></summary>

Real-time calculation and display of:
- Short-circuit current density (Jsc) in A/m² and mA/cm²
- Open-circuit voltage (Voc) in volts
- Fill factor (FF) as percentage
- Power conversion efficiency (PCE) as percentage
- **Loss analysis**: thermalization, transmission, radiative, Auger

</details>

<details>
<summary><b>Optical Profile Plotting</b></summary>

- Wavelength-dependent R, T, and A spectra
- Color-coded layer absorption overlay
- Integrated plot export (PNG, PDF, SVG)
- Dark-mode GUI with light-mode export option

</details>

### 🟣 Data Handling & Export

<details>
<summary><b>Simulation State Management</b></summary>

- **Save complete simulations** as `.soley` files (JSON format)
- Stores layer stack, optical data paths, device parameters, defect settings
- **Load and resume** previous work instantly
- Batch processing compatibility

</details>

<details>
<summary><b>Export Options</b></summary>

- **Optical profiles**: R(λ), T(λ), A(λ) to CSV
- **Generation profiles**: G(x, λ) to CSV with spatial coordinates
- **J-V curves**: Voltage-current pairs to CSV
- **EQE spectra**: λ vs. EQE to CSV
- **Results table**: Multi-run parameter sweep data

</details>

<details>
<summary><b>Batch Calculations & Optimization</b></summary>

- **Parameter sweeps**: Thickness, bandgap, defects, resistances
- **Multi-variable optimization**: Up to 10 simultaneous parameters
- Progress tracking with real-time updates
- Results aggregation in tabular format

</details>

---

## 🔽 Download

### Executables (v1.3)

| Platform | Download Link | Size |
|----------|---------------|------|
| **Windows** | [SOLEY-Windows_1_3.exe](https://zenodo.org/records/17144667/files/SOLEY-Windows_1_3.exe?download=1) | ~150 MB |
| **macOS** | [SOLEY-macOS_1_3.zip](https://zenodo.org/records/17144667/files/SOLEY-macOS_1_3.zip?download=1) | ~160 MB |
| **Linux** | [SOLEY-Linux_1_3](https://zenodo.org/records/17144667/files/SOLEY-Linux_1_3?download=1) | ~155 MB |

### Documentation

📖 **[SOLEY Manual v1.3](https://github.com/zacharie-li-kao/SOLEY-PV/blob/main/SOLEY_Manual_1.3.pdf)** (PDF)

> **Note**: Some newly added features may not yet be documented. Check the GUI tooltips or contact the developer for assistance.

### All Releases

👉 **[View on Zenodo](https://zenodo.org/records/17144667)** for complete version history and DOI references.

---

## 🔧 Installation

### Security Warning

Your operating system will flag SOLEY as potentially unsafe because the executable is **not code-signed**. This is normal for independent academic software and does not indicate malware.

### Platform-Specific Instructions

<details>
<summary><b>Windows 10/11</b></summary>

1. Download `SOLEY-Windows_1_3.exe`
2. Double-click to run
3. When Windows Defender SmartScreen appears:
   - Click **"More info"**
   - Click **"Run anyway"**
4. Accept the license agreement in the splash screen

**Known Issues**:
- On some high-DPI displays, GUI elements may appear misaligned. This is a known tkinter limitation.

</details>

<details>
<summary><b>macOS (Intel & Apple Silicon)</b></summary>

1. Download and extract `SOLEY-macOS_1_3.zip`
2. Open Terminal and navigate to the extracted folder
3. Make executable:
   ```bash
   chmod +x SOLEY_1.3
   ```
4. Run:
   ```bash
   ./SOLEY_1.3
   ```
5. If blocked by Gatekeeper:
   - Go to **System Preferences** → **Security & Privacy**
   - Click **"Open Anyway"** next to the SOLEY warning

**Known Issues**:
- GUI scaling may not work correctly on some Mac models (developer does not have access to macOS hardware for testing)

</details>

<details>
<summary><b>Linux (Ubuntu/Debian/Fedora)</b></summary>

1. Download `SOLEY-Linux_1_3`
2. Make executable:
   ```bash
   chmod +x SOLEY-Linux_1_3
   ```
3. Run:
   ```bash
   ./SOLEY-Linux_1_3
   ```

**Dependencies** (usually pre-installed):
- `libgtk-3-0` for GUI
- `libffi7` for Python runtime

</details>

---

## 🚀 Quick Start

### Basic Workflow

1. **Build Layer Stack**
   - Click "Add Layer" and select optical data file (n, k vs. wavelength)
   - Enter thickness in nanometers
   - Mark absorber layers with "Abs" checkbox
   - Use "A(λ)" checkbox to export absorption spectra

2. **Configure Optical Calculation**
   - Set wavelength range (typically 300–1300 nm)
   - Choose illumination mode (direct/diffuse)
   - Select polarization
   - Click **"RUN OPTICAL CALCULATION"**

3. **Set Device Parameters**
   - Input bandgaps for each absorber (or use auto-detection)
   - Load incident spectrum (e.g., AM1.5G)
   - Set temperature (default: 300 K)
   - Adjust injection slider for light concentration

4. **Define Recombination**
   - Go to **Defects** tab
   - Click absorber button to open defect window
   - Enter microscopic parameters or use defaults
   - Computed J₀ values are automatically stored

5. **Calculate Performance**
   - Click **"CALCULATE DEVICE PARAMS"**
   - View results table with Jsc, Voc, FF, efficiency
   - Export data or plot J-V curves

### Example: Perovskite/Silicon Tandem

```
Layer Stack (front to back):
  1. Glass (substrate) - 1 mm
  2. ITO (front contact) - 100 nm
  3. Perovskite (absorber) - 500 nm, Eg = 1.68 eV
  4. Silicon (absorber) - 200 μm, Eg = 1.12 eV
  5. Ag (back contact) - 100 nm

Spectrum: AM1.5G (1000 W/m²)
Results: 
  - Perovskite subcell: Jsc = 19.2 mA/cm², Voc = 1.21 V
  - Silicon subcell: Jsc = 19.2 mA/cm² (current-matched), Voc = 0.71 V
  - 2T Tandem: Voc = 1.92 V, FF = 82%, PCE = 30.3%
```

---

## 🧮 Technical Approach

### Optical Model: Transfer Matrix Method

SOLEY implements the **Fresnel-based TMM** for stratified media:

- **Exact solution** of Maxwell's equations in planar geometry
- **Coherent interference** effects in thin films
- **Incoherent** limit available for thick substrates (future update)

The method computes:
- Electric field amplitude and phase at any position
- Poynting vector for energy flux calculations
- Absorption coefficient α from extinction coefficient k

**Reference**: Pettersson et al., *J. Appl. Phys.* **86**, 487 (1999)

### Electrical Model: Extended Detailed Balance

The device physics engine solves:

```
J(V) = Jph - J0_rad·[exp(qV/kT) - 1] 
            - J0_SRH·[exp(qV/nkT) - 1]
            - JAuger(V)
            - V/Rsh 
            - J·Rs
```

Where:
- **Jph**: Photogenerated current from TMM absorption
- **J0_rad**: Radiative recombination (Planck integral)
- **J0_SRH**: Defect recombination (Scaffidi formulation)
- **JAuger**: Auger recombination (carrier-dependent)

**Key advantage**: No need to solve Poisson-drift-diffusion system, enabling:
- ✅ Faster iteration for design screening
- ✅ Thermodynamic consistency checks
- ✅ Direct link between optical and electrical models

**Reference**: Jehl Li-Kao, *Solar RRL* (2025), DOI: 10.1002/solr.202500345

### Defect Modeling: Scaffidi Formulation

SOLEY translates **microscopic trap parameters** into macroscopic J₀:

**Bulk recombination**:
```
J₀₀_bulk = π·kB·T·√(ε·Nc·Nv/(2·q·Vbi·Ndop))·vth·σn·Nt
```

**Interface recombination**:
```
J₀₀_interface = q·Sp·Ndop·[(Nc_adj·Nv)/(Ndop_adj·Ndop)]^(1-θ)
```

Final J₀_SRH includes activation energy:
```
J₀_SRH = (J₀₀_bulk + J₀₀_interface)·exp(-Ea/(n·kB·T))
```

**Reference**: Scaffidi et al., *Solar RRL* **1**, 1700056 (2017)

---

## 🛣️ Roadmap

### Planned Features

- [ ] **Incoherent TMM** for thick substrates and glass
- [ ] **Drift-diffusion EQE** solver with mobility input
- [ ] **Intermediate band solar cells** (IBSC) physics
- [ ] **Hot carrier devices** with non-thermal distributions
- [ ] **Spectral mismatch** correction tools (M-factor)
- [ ] **Angle-resolved scattering** (BSDF integration)
- [ ] **GUI localization** (Spanish, French, Chinese)

### Known Limitations

- **Bruggeman mixing** can cause layer indexing issues (use with caution)
- **Parallel processing** overhead sometimes slower than serial for small datasets
- **macOS GUI scaling** untested on all hardware variants
- **No built-in database** of optical constants (users must provide n, k files)

---

## 📖 Citation

If you use SOLEY in your research, please cite:

> **Jehl Li-Kao, Z.** "SOLEY: a package for optical and extended detailed balance model for photovoltaic device simulation." *Solar RRL* (2025). DOI: [10.1002/solr.202500345](https://doi.org/10.1002/solr.202500345)

### BibTeX

```bibtex
@article{jehl2025soley,
  author  = {Zacharie Jehl Li-Kao},
  title   = {SOLEY: a package for optical and extended detailed balance model 
             for photovoltaic device simulation},
  journal = {Solar RRL},
  year    = {2025},
  doi     = {10.1002/solr.202500345}
}
```

---

## 📜 License

**SOLEY** is distributed for **academic use only**. Commercial use requires explicit written permission from the author.

By downloading and using SOLEY, you agree to:
- Use the software strictly for non-commercial research and educational purposes
- Cite the software in any publications or presentations
- Not redistribute modified versions without permission

See the license agreement displayed at startup for full terms.

---

## 💬 Contact

**Developer**: Zacharie Jehl Li-Kao  
**Email**: zacharie.jehl@upc.edu  
**Institution**: Universitat Politècnica de Catalunya (UPC), Barcelona

### Support & Feedback

- **Bug reports**: Open an issue on GitHub (preferred)
- **Feature requests**: Email with "[SOLEY Feature]" in subject line
- **Collaboration inquiries**: Email with "[SOLEY Collaboration]" in subject

### Acknowledgments

Development of SOLEY was supported by research activities at UPC. The author thanks the photovoltaics community for feedback and testing.

---

<div align="center">

**Made with ☀️ for the solar energy research community**

⭐ *If you find SOLEY useful, please star this repository and share with colleagues!*

</div>
