<img src="logo.png" alt="SOLEY Logo" width="300">

# SOLEY – Scientific Solar Cell Simulation Package

**SOLEY** is a scientific-grade simulation software designed to model the **optical** and **electrical performance** of photovoltaic (PV) solar cells. It doesn't aim to replace existing packages using the drift-diffusion model, but rather to **complement** them by offering an alternative, rigorous approach based on the **Extended Detailed Balance Framework**.

---

##  Core Methodology: Alternative to Drift-Diffusion

SOLEY is built on two primary physics engines that work in tandem: the **Optical Engine (TMM)** and the **Electrical Engine (Extended Detailed Balance)**.

### **Key Features at a Glance**

| Feature Area | Core Capability | Key Physics/Methodology |
| :--- | :--- | :--- |
| **Optics** | $R$, $T$, Absorption Profiles, $G(x)$ | **Transfer Matrix Method (TMM)**, Bruggeman Effective Medium Approx. |
| **Electrics** | J-V Curves, $\text{V}_{\text{OC}}$, $\text{J}_{\text{SC}}$, $\eta$, Loss Analysis | **Extended Detailed Balance Framework** (SQ-Limit + Non-radiative Losses) |
| **Recombination** | Radiative, Non-Radiative ($SRH$, Auger) | **Van Roosbroeck-Shockley (VRS) Relation**, Scaffidi $\text{J}_{0,SRH}$ Formulation |
| **Analysis** | J-V, R/T/A Plots, Bandgap Extraction, Parameter Sweeps | **Photoluminescence (PL) / Electroluminescence (EL)** Spectra (Future EQE) |

---

## 🟢 Optical Simulation & Generation Profile

SOLEY uses the **Transfer Matrix Method (TMM)**, works great for thin-film optics, to precisely calculate how light interacts with your multilayer device stack.

* **TMM Core Engine:** Calculates **Reflectance ($\mathbf{R}$)**, **Transmittance ($\mathbf{T}$)**, and the internal **electric field profiles ($\mathbf{|E|^2}$)** across the device.
* **Generation Rate ($\mathbf{G(x)}$):** The absorbed power is converted into a spatially-resolved **generation profile** (photons/m³/s), which is crucial input for the electrical model.
* **Wavelength & Angle Control:** Supports **Direct (Collimated)** and **Diffuse (Hemispherical)** illumination, with full control over the **incidence angle ($\theta$)** and **polarisation (TE, TM, or unpolarised)**.
* **Complex Layers:** Features the **Bruggeman effective medium approximation** for accurately simulating composite/nanostructured layers (note: occasionally buggy, esepcially for luminescence, may require user verification).
* **Performance:** Utilises **parallel wavelength processing** for speed, though note that overheads can sometimes impact performance 🗿.
* **Numerical checks:** Normally, TMM starts giving crazy stuff when layer thickness is too large. I implemented a few numerical optimisation to prevent that and it should be ok for thikcnesses up to 150 ($\mu$)m, which means that c-Si should be possible. But don't be surprised if sometimes, you get a bit of divergence. It is inherent to the TMM method.

---

## 🔵 Device Physics & Electrical Modelling

The electrical performance is determined using an **Extended Detailed Balance Framework**, which directly calculates losses due to non-ideal recombination and parasitic resistances.

* **Recombination Mechanisms:** All major recombination pathways are rigorously accounted for by calculating their corresponding saturation current densities ($\mathbf{J_{0}}$):
    * **Radiative ($\mathbf{J_{0,rad}}$):** Calculated from the **Van Roosbroeck-Shockley (VRS) relation** and the blackbody emission spectrum.
    * **Shockley-Read-Hall (SRH) ($\mathbf{J_{0,SRH}}$):** Modeled using the **Scaffidi et al. formulation**, allowing for custom input of microscopic defect parameters (trap density, capture cross-sections, activation energy, etc.). The whole enchilada. Check the enchilada here https://www.cell.com/newton/fulltext/S2950-6360(25)00190-2
    * **Auger ($\mathbf{J_{0,Auger}}$):** Explicitly calculated with temperature and bandgap dependence.
* **Performance Limits:** The package allows for **bypassing the optical calculation** to use a **step absorption** (as in the traditional **Shockley-Queisser (SQ) Limit**) for fast comparison and validation. Setting non-radiative recombination and resistances to zero will reproduce the theoretical SQ limit.
* **Device Non-Idealities:** Accurately incorporates the effects of **Series Resistance ($\mathbf{R_s}$)** and **Shunt Resistance ($\mathbf{R_{sh}}$)**.
* **Multijunction Support:** Handles complex devices in **2T, 4T/6T configurations**, calculating the final current-matched performance.
* *NOTE:* Includes a dynamic carrier injection variation slider for testing, but be aware it is a bit inaccurate. And importantly, the non-linearities at very injection are not yet implemented, so it is for physics illustration purpose.

---

## 🟣 Analysis & Data Handling

SOLEY provides some tools for visualising, analysing, and exporting your simulation results.

### **Analysis & Visualisation**
* **J–V Curve Generation:** Produce both **illuminated J-V curves** (incorporating all $R_{s}/R_{sh}$ and recombination losses) and **dark J-V curves**.
* **Optical Spectra Plotting:** Quickly plot **Reflectance ($\mathbf{R}$)**, **Transmittance ($\mathbf{T}$)**, and **Internal Absorption** spectra.
* **Photoluminescence/Electroluminescence:** It leverages the **VRS relation** to calculate **PL and EL spectra** based on TMM absorptivity and the calculated quasi-Fermi level splitting.
* **Parameter Sweeps:** Easily set up **batch parameter sweeps** and **thickness optimisation** routines.

### **Data Handling & Export**
* **Simulation State:** Save and load full simulation states using **`.soley` files**. There are also a few included presets.
* **Data Export:** Export all profiles and curves to **CSV files** for external analysis (optical profiles, generation data, J–V curves, etc.).

> **Future Roadmap:** I plan to integrate **EQE calculations** (using thermodynamic equations to complement packages like SCAPS) but that's really hard so far, other built-in recombination pathways, Intermediate Band Solar Cells, and Hot Carrier Solar Cells. Just be patient with me.

---

## ⬇️ Download & Installation

The latest executable versions are available below.

| Platform | Download Link | File Type |
| :--- | :--- | :--- |
| **Windows** | [SOLEY-Windows\_1\_3.exe](https://zenodo.org/records/17144667/files/SOLEY-Windows_1_3.exe?download=1) | Executable |
| **macOS** | [SOLEY-macOS\_1\_3.zip](https://zenodo.org/records/17144667/files/SOLEY-macOS_1_3.zip?download=1) | Compressed Executable |
| **Linux** | [SOLEY-Linux\_1\_3](https://zenodo.org/records/17144667/files/SOLEY-Linux_1_3?download=1) | Executable |

The SOLEY Manual is available here: **[SOLEY Manual 1.01](https://github.com/zacharie-li-kao/SOLEY-PV/blob/main/SOLEY_Manual_1.3.pdf)**
New functionalities may not appear directly in the manual, as I am sometimes a bit lazy 🗿. Apologies

👉 **[View full release on Zenodo](https://zenodo.org/records/16151991)**

### ❗ Installation & Security Warning

Your Operating System will likely flag SOLEY as unsafe because it is **unsigned software**. This is normal for independent developer packages and is safe to ignore.

| Platform | Security Warning | Installation Steps |
| :--- | :--- | :--- |
| **Windows** | "Windows protected your PC" | 1. Download `SOLEY-Windows_1_3.exe`<br>2. Click **"More info"** → **"Run anyway"** |
| **macOS** | "Developer cannot be verified" | 1. Open Terminal and run: `chmod +x SOLEY_1_3`<br>2. Run the executable: `./SOLEY_1_3`<br>3. If blocked: Go to System Preferences → Security & Privacy → **Allow** |
| **Linux** | Execution Denied | 1. Open Terminal and run: `chmod +x SOLEY_1_3`<br>2. Run the executable: `./SOLEY_1_3` |

---

## 📜 How to Cite

If you use SOLEY in your research or published work, please cite the following article:

> Jehl Li-Kao, Z. "*SOLEY: a package for optical and extended detailed balance model for photovoltaic device simulation.*" *Solar RRL* (2025). DOI: **[https://doi.org/10.1002/solr.202500345]**

### **BibTeX**

```bibtex
@article{jehl2025soley,
  author = {Zacharie Jehl Li-Kao},
  title = {SOLEY: a package for optical and extended detailed balance model for photovoltaic device simulation},
  journal = {Solar RRL},
  year = {2025},
  doi = {10.1002/solr.202500345}
}
