import tkinter as tk
from tkinter import ttk, messagebox, scrolledtext
import socket
import threading
from datetime import datetime
import re

class AdvancedPortScanner:
    def __init__(self, host):
        self.host = host
        self.open_ports = []
        self.is_scanning = False
        self.closed_ports = []
        
    def is_host_valid(self):
        """Valida si el host es una IP válida o un dominio válido"""
        try:
            socket.gethostbyname(self.host)
            return True
        except socket.gaierror:
            return False

    def detect_firewall(self):
        """Intenta detectar si la IP objetivo tiene un firewall activado (filtra paquetes)"""
        if self.host.lower() in ['localhost', '127.0.0.1', '0.0.0.0']:
            return False
            
        try:
            # Probar un puerto inusual (44444)
            # 110/10060: Timeout (paquete descartado silenciosamente por firewall)
            # 11: EAGAIN/EWOULDBLOCK (a veces devuelto en timeout en Linux)
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(1.0)
            result = sock.connect_ex((self.host, 44444))
            sock.close()
            
            if result in [11, 110, 10060]:
                return True
            return False
        except:
            return True
    
    def check_port(self, port):
        """Verifica si un puerto específico está abierto"""
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(1.0)  # Aumentado a 1 segundo
            result = sock.connect_ex((self.host, port))
            sock.close()
            
            # Si obtiene timeout, reintentar con timeout más largo
            if result == 110:
                try:
                    sock2 = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                    sock2.settimeout(1.5)
                    result2 = sock2.connect_ex((self.host, port))
                    sock2.close()
                    return result2 == 0
                except:
                    return False
            return result == 0
        except:
            return False
    
    def get_open_ports(self):
        return sorted(self.open_ports)


class ModernPortScannerUI:
    # Colores tema oscuro profesional
    COLORS = {
        'bg': '#1e1e1e',
        'fg': '#e0e0e0',
        'accent': '#0d47a1',
        'success': '#4caf50',
        'warning': '#ff9800',
        'error': '#f44336',
        'border': '#3a3a3a'
    }
    
    def __init__(self, root):
        self.root = root
        self.root.title("🔍 Escáner de Puertos Avanzado - Hacking Ético")
        self.root.geometry("850x800")
        self.root.resizable(True, True)
        
        # Configurar estilo
        self.setup_styles()
        self.scanner = None
        self.scan_thread = None
        
        self.setup_ui()
    
    def setup_styles(self):
        """Configura los estilos de la aplicación"""
        style = ttk.Style()
        style.theme_use('clam')
        
        # Colores base
        style.configure('TFrame', background=self.COLORS['bg'])
        style.configure('TLabel', background=self.COLORS['bg'], foreground=self.COLORS['fg'])
        style.configure('TLabelframe', background=self.COLORS['bg'], foreground=self.COLORS['fg'])
        style.configure('TLabelframe.Label', background=self.COLORS['bg'], foreground=self.COLORS['fg'])
        
        style.configure('TEntry', fieldbackground='#2a2a2a', foreground=self.COLORS['fg'])
        style.configure('TRadiobutton', background=self.COLORS['bg'], foreground=self.COLORS['fg'])
        
        # Botones
        style.configure('TButton', background=self.COLORS['accent'], foreground='white')
        style.map('TButton', 
                 background=[('active', '#1a35ad'), ('disabled', '#7a7a7a')],
                 foreground=[('disabled', '#a0a0a0')])
        
        # Progressbar
        style.configure('TProgressbar', background=self.COLORS['accent'])
    
    def setup_ui(self):
        """Configura la interfaz de usuario completa"""
        # Frame principal con scroll
        main_container = ttk.Frame(self.root)
        main_container.pack(fill=tk.BOTH, expand=True, padx=0, pady=0)
        
        # Encabezado
        self.setup_header(main_container)
        
        # Frame de configuración
        self.setup_config_frame(main_container)
        
        # Frame de progreso
        self.setup_progress_frame(main_container)
        
        # Frame de resultados
        self.setup_results_frame(main_container)
        
        # Frame inferior con información
        self.setup_status_frame(main_container)
    
    def setup_header(self, parent):
        """Encabezado de la aplicación"""
        header = ttk.Frame(parent)
        header.pack(fill=tk.X, padx=15, pady=15)
        
        title_label = ttk.Label(header, text="🔍 ESCÁNER DE PUERTOS", 
                               font=('Arial', 16, 'bold'))
        title_label.pack(side=tk.LEFT)
        
        subtitle_label = ttk.Label(header, text="Hacking Ético", 
                                  font=('Arial', 10))
        subtitle_label.pack(side=tk.LEFT, padx=20)
    
    def setup_config_frame(self, parent):
        """Frame de configuración del escaneo"""
        config_frame = ttk.LabelFrame(parent, text="⚙️  Configuración del Escaneo", padding=15)
        config_frame.pack(fill=tk.X, padx=15, pady=10)
        
        # Fila 1: Host
        ttk.Label(config_frame, text="🖥️  Host:").grid(row=0, column=0, sticky=tk.W, pady=8)
        self.host_entry = ttk.Entry(config_frame, width=40)
        self.host_entry.grid(row=0, column=1, sticky=tk.EW, padx=10, pady=8)
        self.host_entry.insert(0, "localhost")
        
        config_frame.columnconfigure(1, weight=1)
        
        # Fila 2: Tipo de escaneo
        ttk.Label(config_frame, text="📡 Tipo:").grid(row=1, column=0, sticky=tk.W, pady=8)
        self.scan_type = tk.StringVar(value="rango")
        
        type_frame = ttk.Frame(config_frame)
        type_frame.grid(row=1, column=1, sticky=tk.W, padx=10, pady=8)
        
        ttk.Radiobutton(type_frame, text="Puerto", variable=self.scan_type, 
                       value="single", command=self.update_port_fields).pack(side=tk.LEFT, padx=10)
        ttk.Radiobutton(type_frame, text="Rango", variable=self.scan_type, 
                       value="rango", command=self.update_port_fields).pack(side=tk.LEFT, padx=10)
        ttk.Radiobutton(type_frame, text="Todos (1-65535)", variable=self.scan_type, 
                       value="todos", command=self.update_port_fields).pack(side=tk.LEFT, padx=10)
        
        # Fila 3: Puertos
        ttk.Label(config_frame, text="🔌 Puerto Inicial:").grid(row=2, column=0, sticky=tk.W, pady=8)
        self.port_start_entry = ttk.Entry(config_frame, width=15)
        self.port_start_entry.grid(row=2, column=1, sticky=tk.W, padx=10, pady=8)
        self.port_start_entry.insert(0, "80")
        
        # Fila 4: Puerto final
        ttk.Label(config_frame, text="🔌 Puerto Final:").grid(row=3, column=0, sticky=tk.W, pady=8)
        self.port_end_entry = ttk.Entry(config_frame, width=15)
        self.port_end_entry.grid(row=3, column=1, sticky=tk.W, padx=10, pady=8)
        self.port_end_entry.insert(0, "443")
        
        # Fila 5: Botones de acción
        button_frame = ttk.Frame(config_frame)
        button_frame.grid(row=4, column=0, columnspan=2, sticky=tk.W, pady=15)
        
        self.scan_button = ttk.Button(button_frame, text="▶ Iniciar", 
                                     command=self.start_scan, width=15)
        self.scan_button.pack(side=tk.LEFT, padx=5)
        
        self.stop_button = ttk.Button(button_frame, text="⏹ Detener", 
                                     command=self.stop_scan, width=15, state=tk.DISABLED)
        self.stop_button.pack(side=tk.LEFT, padx=5)
        
        self.clear_button = ttk.Button(button_frame, text="🗑️  Limpiar", 
                                      command=self.clear_results, width=15)
        self.clear_button.pack(side=tk.LEFT, padx=5)
        
        self.update_port_fields()
    
    def setup_progress_frame(self, parent):
        """Frame con barra de progreso"""
        progress_frame = ttk.LabelFrame(parent, text="📊 Progreso", padding=15)
        progress_frame.pack(fill=tk.X, padx=15, pady=10)
        
        self.progress_bar = ttk.Progressbar(progress_frame, mode='determinate', length=400)
        self.progress_bar.pack(fill=tk.X, padx=5, pady=10)
        
        self.progress_label = ttk.Label(progress_frame, text="0%", font=('Arial', 10, 'bold'))
        self.progress_label.pack()
    
    def setup_results_frame(self, parent):
        """Frame con resultados del escaneo"""
        result_frame = ttk.LabelFrame(parent, text="📋 Resultados", padding=15)
        result_frame.pack(fill=tk.BOTH, expand=True, padx=15, pady=10)
        
        self.result_text = scrolledtext.ScrolledText(result_frame, height=15, width=100, 
                                                    state=tk.DISABLED, wrap=tk.WORD,
                                                    background='#1a1a1a', foreground='#e0e0e0')
        self.result_text.pack(fill=tk.BOTH, expand=True)
        
        # Configurar tags para colores
        self.result_text.tag_configure("open", foreground=self.COLORS['success'])
        self.result_text.tag_configure("closed", foreground="#999999")
        self.result_text.tag_configure("error", foreground=self.COLORS['error'])
        self.result_text.tag_configure("info", foreground="#87ceeb")
        self.result_text.tag_configure("header", foreground="#64b5f6", font=('Arial', 10, 'bold'))
        self.result_text.tag_configure("warning", foreground=self.COLORS['warning'])
        self.result_text.tag_configure("success", foreground=self.COLORS['success'])
    
    def setup_status_frame(self, parent):
        """Frame de estado inferior"""
        status_frame = ttk.Frame(parent)
        status_frame.pack(fill=tk.X, padx=15, pady=10)
        
        self.info_label = ttk.Label(status_frame, text="✓ Listo para escanear", 
                                relief=tk.SUNKEN, pad=10)
        self.info_label.pack(fill=tk.X)
    
    def update_port_fields(self):
        """Actualiza disponibilidad de campos según tipo de escaneo"""
        scan_type = self.scan_type.get()
        
        if scan_type == "single":
            self.port_start_entry.config(state=tk.NORMAL)
            self.port_end_entry.config(state=tk.DISABLED)
        elif scan_type == "rango":
            self.port_start_entry.config(state=tk.NORMAL)
            self.port_end_entry.config(state=tk.NORMAL)
        else:
            self.port_start_entry.config(state=tk.DISABLED)
            self.port_end_entry.config(state=tk.DISABLED)
    
    def validate_inputs(self):
        """Valida los datos ingresados"""
        host = self.host_entry.get().strip()
        if not host:
            messagebox.showerror("Error", "Ingresa un host válido")
            return False
        
        try:
            if self.scan_type.get() == "single":
                port = int(self.port_start_entry.get())
                if not (1 <= port <= 65535):
                    raise ValueError("Puerto debe estar entre 1-65535")
            elif self.scan_type.get() == "rango":
                start = int(self.port_start_entry.get())
                end = int(self.port_end_entry.get())
                if not (1 <= start <= 65535 and 1 <= end <= 65535 and start <= end):
                    raise ValueError("Rango de puertos inválido")
        except ValueError as e:
            messagebox.showerror("Error", str(e))
            return False
        
        return True
    
    def start_scan(self):
        """Inicia el escaneo"""
        if not self.validate_inputs():
            return
            
        host = self.host_entry.get().strip()
        self.scanner = AdvancedPortScanner(host)
        
        if not self.scanner.is_host_valid():
            messagebox.showerror("Error", f"No se puede resolver el host '{host}'")
            return
            
        self.has_firewall = self.scanner.detect_firewall()
        if self.has_firewall:
            respuesta = messagebox.askyesno(
                "🛡️ Firewall Detectado", 
                f"Se ha detectado que el host {host} tiene un FIREWALL ACTIVADO.\n\n"
                "Esto podría bloquear los paquetes y hacer que los puertos parezcan cerrados "
                "incluso si están en uso, además de ralentizar el escaneo.\n\n"
                "¿Deseas continuar con el escaneo de todas formas?"
            )
            if not respuesta:
                return
        
        self.scan_button.config(state=tk.DISABLED)
        self.stop_button.config(state=tk.NORMAL)
        self.progress_bar['value'] = 0
        
        self.scan_thread = threading.Thread(target=self.perform_scan, daemon=True)
        self.scan_thread.start()
    
    def perform_scan(self):
        """Realiza el escaneo en hilo separado"""
        host = self.host_entry.get().strip()
        scan_type = self.scan_type.get()
        
        self.result_text.config(state=tk.NORMAL)
        self.result_text.delete(1.0, tk.END)
        self.result_text.config(state=tk.DISABLED)
        
        firewall_status = "ACTIVADO 🛡️ (Posible bloqueo/filtrado)" if getattr(self, 'has_firewall', False) else "DESACTIVADO / NO DETECTADO"
        
        # Encabezado
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self.add_result("=" * 70 + "\n", "header")
        self.add_result(f"Escáner de Puertos | {timestamp}\n", "header")
        self.add_result(f"Host: {host} | Tipo: {scan_type}\n", "info")
        
        if getattr(self, 'has_firewall', False):
            self.add_result(f"Estado Firewall: {firewall_status}\n", "warning")
        else:
            self.add_result(f"Estado Firewall: {firewall_status}\n", "success")
            
        self.add_result("=" * 70 + "\n\n", "header")
        
        self.add_result(f"✓ Host válido. Iniciando escaneo...\n\n", "info")
        
        try:
            if scan_type == "single":
                self.scan_single()
            elif scan_type == "rango":
                self.scan_range()
            else:
                self.scan_all()
        except Exception as e:
            self.add_result(f"❌ Error: {str(e)}\n", "error")
        
        self.display_summary()
        self.end_scan()
    
    def scan_single(self):
        """Escanea un puerto específico"""
        port = int(self.port_start_entry.get())
        if self.scanner.check_port(port):
            self.scanner.open_ports.append(port)
            try:
                service = socket.getservbyport(port)
                self.add_result(f"✓ Puerto {port:5d} - {service.upper()}\n", "open")
            except:
                self.add_result(f"✓ Puerto {port:5d} - ABIERTO\n", "open")
        else:
            self.add_result(f"✗ Puerto {port:5d} - CERRADO\n", "closed")
    
    def scan_range(self):
        """Escanea un rango de puertos"""
        start = int(self.port_start_entry.get())
        end = int(self.port_end_entry.get())
        total = end - start + 1
        
        self.scanner.is_scanning = True
        for i, port in enumerate(range(start, end + 1)):
            if not self.scanner.is_scanning:
                break
            
            if self.scanner.check_port(port):
                self.scanner.open_ports.append(port)
                try:
                    service = socket.getservbyport(port)
                    self.add_result(f"✓ Puerto {port:5d} - {service.upper()}\n", "open")
                except:
                    self.add_result(f"✓ Puerto {port:5d}\n", "open")
            
            progress = ((i + 1) / total) * 100
            self.progress_bar['value'] = progress
            self.progress_label.config(text=f"{progress:.0f}%")
            self.root.update_idletasks()
    
    def scan_all(self):
        """Escanea todos los puertos"""
        self.scanner.is_scanning = True
        self.add_result("Escaneando puertos 1-65535...\n\n", "info")
        
        for i in range(1, 65536):
            if not self.scanner.is_scanning:
                break
            
            if self.scanner.check_port(i):
                self.scanner.open_ports.append(i)
                try:
                    service = socket.getservbyport(i)
                    self.add_result(f"✓ Puerto {i:5d} - {service.upper()}\n", "open")
                except:
                    self.add_result(f"✓ Puerto {i:5d}\n", "open")
            
            if i % 1000 == 0:
                progress = (i / 65535) * 100
                self.progress_bar['value'] = progress
                self.progress_label.config(text=f"{progress:.0f}%")
                self.root.update_idletasks()
    
    def display_summary(self):
        """Muestra resumen de resultados"""
        if self.scanner.open_ports:
            self.add_result("\n" + "=" * 70 + "\n", "header")
            self.add_result(f"PUERTOS ABIERTOS: {len(self.scanner.open_ports)}\n", "header")
            self.add_result("=" * 70 + "\n\n", "header")
        else:
            self.add_result("\n⚠️  No se encontraron puertos abiertos\n\n", "info")
    
    def stop_scan(self):
        """Detiene el escaneo"""
        if self.scanner:
            self.scanner.is_scanning = False
        self.add_result("\n⚠️  Escaneo detenido por el usuario\n", "error")
        self.end_scan()
    
    def end_scan(self):
        """Finaliza el escaneo"""
        self.progress_bar['value'] = 100
        self.progress_label.config(text="100%")
        
        self.scan_button.config(state=tk.NORMAL)
        self.stop_button.config(state=tk.DISABLED)
        
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self.add_result(f"\nFin: {timestamp}\n", "info")
        
        if self.scanner and self.scanner.open_ports:
            self.info_label.config(text=f"✓ Completado | Puertos abiertos: {len(self.scanner.open_ports)}")
        else:
            self.info_label.config(text="✓ Completado")
    
    def add_result(self, text, tag=""):
        """Añade texto a resultados"""
        self.result_text.config(state=tk.NORMAL)
        self.result_text.insert(tk.END, text, tag)
        self.result_text.see(tk.END)
        self.result_text.config(state=tk.DISABLED)
    
    def clear_results(self):
        """Limpia resultados"""
        self.result_text.config(state=tk.NORMAL)
        self.result_text.delete(1.0, tk.END)
        self.result_text.config(state=tk.DISABLED)
        self.progress_bar['value'] = 0
        self.progress_label.config(text="0%")
        self.info_label.config(text="✓ Listo para escanear")


def main():
    root = tk.Tk()
    app = ModernPortScannerUI(root)
    root.mainloop()


if __name__ == "__main__":
    main()
