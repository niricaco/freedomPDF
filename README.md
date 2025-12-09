# FreedomPDF User Guide

This documentation helps you start and use the FreedomPDF application. It is designed to be easy to follow without any technical background.

**Magyar nyelvű útmutatóért lásd a `HASZNALATI_UTMUTATO.md` fájlt.**

## Table of Contents
1. [Start on Windows (Quickest Method)](#1-start-on-windows-quickest-method)
2. [Manual Setup (Mac & Windows)](#2-manual-setup-mac--windows)
3. [Alternative Method: Docker](#3-alternative-method-docker)
4. [Using the Application](#4-using-the-application)

---

## 1. Start on Windows (Quickest Method)

If you are using Windows, we created a tool that handles almost everything for you.

1.  Open the folder where you downloaded the project.
2.  Find the `start_windows.bat` file.
3.  Double-click it.

**What will happen?**
*   **Check:** The program checks if "Node.js" is installed.
    *   *If not:* It will alert you and open the download page. Download the "LTS" version, install it (just click "Next"), and then run `start_windows.bat` again.
*   **Installation:** If this is the first run, it downloads necessary components (this may take a few minutes).
*   **Start:** The server starts running in a black window. **Do not close this window!**
*   **Browser:** After a few seconds, your browser will open automatically. If not, type `http://localhost:3000` into the address bar.

---

## 2. Manual Setup (Mac & Windows)

If you are using a Mac or the method above didn't work, follow these steps.

### Step 1: Install Node.js
The program requires the Node.js environment to run.
1.  Visit: [https://nodejs.org/](https://nodejs.org/)
2.  Download the **LTS** (Recommended) version.
3.  Install it on your computer.

### Step 2: Prepare the Program
1.  Open "Terminal" (Mac) or "Command Prompt" / "PowerShell" (Windows).
2.  Navigate to the folder where you downloaded the program.
    *   Tip: Type `cd `, drag the folder into the window, and press Enter.
3.  Type the following command and press Enter:
    ```bash
    npm install
    ```
    *   Wait for it to finish (you will see text scrolling).

### Step 3: Start
1.  Type the following command:
    ```bash
    npm run dev
    ```
2.  When you see "Ready" or "started server", open your browser.
3.  Type in the address bar: `http://localhost:3000`

---

## 3. Alternative Method: Docker

If the methods above fail, and you have Docker installed (or your admin recommends it), use this method. It runs the program in an isolated environment.

1.  Ensure **Docker Desktop** is running.
2.  Open the terminal in the program's folder.
3.  Run this command:
    ```bash
    docker-compose up --build
    ```
4.  Wait for the process to finish (can take a long time on first run).
5.  Open your browser: `http://localhost:3000`

---

## 4. Using the Application

The goal of the program is to manage PDF files and convert coordinates.

1.  **Upload File:**
    *   On the home screen, you will find an upload area.
    *   Drag and drop a PDF file, or click to browse.
    *   For security, the file is renamed to a unique ID internally.

2.  **View:**
    *   After uploading, the PDF will appear on the screen.

3.  **Troubleshooting:**
    *   If the program doesn't load, check the black window (terminal) to see if it's still running.
    *   If you see an error, try restarting: close the window and run the `start_windows.bat` file or the command again.
