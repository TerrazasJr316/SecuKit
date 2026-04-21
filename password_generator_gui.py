#!/usr/bin/env python3
"""
Generador de Contraseñas Seguras - Versión GUI Avanzada
Interfaz gráfica moderna con Tkinter para generar contraseñas seguras
"""

import tkinter as tk
from tkinter import ttk, scrolledtext, messagebox, filedialog
import random
import string
import threading
from datetime import datetime
import json

class GeneradorContraseñasUI:
    def __init__(self, root):
        self.root = root
        self.root.title("🔐 Generador de Contraseñas Seguras")
        self.root.geometry("900x700")
        self.root.configure(bg='#1e1e1e')
        
        # Configuración de colores (tema oscuro profesional)
        self.colores = {
            'bg_principal': '#1e1e1e',
            'bg_secundario': '#2d2d2d',
            'bg_input': '#3a3a3a',
            'texto': '#e0e0e0',
            'texto_label': '#b0b0b0',
            'acento': '#0d47a1',
            'acento_light': '#1565c0',
            'exito': '#4caf50',
            'error': '#f44336',
            'advertencia': '#ff9800'
        }
        
        # Variables del generador
        self.letras_mayusculas = string.ascii_uppercase
        self.letras_minusculas = string.ascii_lowercase
        self.numeros = string.digits
        self.caracteres_especiales = "!@#$%^&*()_+-=[]{}|;:,.<>?"
        
        self.contraseñas_generadas = []
        self.longitud_minima = 8
        
        self.setup_ui()
    
    def setup_ui(self):
        """Configura la interfaz de usuario"""
        # Frame principal
        main_frame = tk.Frame(self.root, bg=self.colores['bg_principal'])
        main_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        # Título
        titulo = tk.Label(
            main_frame,
            text="🔐 Generador de Contraseñas Seguras",
            font=("Segoe UI", 18, "bold"),
            bg=self.colores['bg_principal'],
            fg=self.colores['acento_light']
        )
        titulo.pack(pady=(0, 20))
        
        # Frame de controles
        control_frame = tk.Frame(main_frame, bg=self.colores['bg_secundario'])
        control_frame.pack(fill=tk.X, pady=(0, 15))
        
        # Longitud
        tk.Label(
            control_frame,
            text="Longitud:",
            font=("Segoe UI", 10),
            bg=self.colores['bg_secundario'],
            fg=self.colores['texto']
        ).pack(side=tk.LEFT, padx=(10, 5), pady=10)
        
        self.entrada_longitud = tk.Entry(
            control_frame,
            width=8,
            font=("Segoe UI", 11),
            bg=self.colores['bg_input'],
            fg=self.colores['texto'],
            insertbackground=self.colores['texto']
        )
        self.entrada_longitud.pack(side=tk.LEFT, padx=5)
        self.entrada_longitud.insert(0, "16")
        
        # Cantidad
        tk.Label(
            control_frame,
            text="Cantidad:",
            font=("Segoe UI", 10),
            bg=self.colores['bg_secundario'],
            fg=self.colores['texto']
        ).pack(side=tk.LEFT, padx=(20, 5), pady=10)
        
        self.entrada_cantidad = tk.Entry(
            control_frame,
            width=8,
            font=("Segoe UI", 11),
            bg=self.colores['bg_input'],
            fg=self.colores['texto'],
            insertbackground=self.colores['texto']
        )
        self.entrada_cantidad.pack(side=tk.LEFT, padx=5)
        self.entrada_cantidad.insert(0, "5")
        
        # Botón generar
        btn_generar = tk.Button(
            control_frame,
            text="🚀 Generar",
            command=self.generar_contraseñas,
            font=("Segoe UI", 11, "bold"),
            bg=self.colores['acento'],
            fg="white",
            padx=20,
            pady=8,
            border=0,
            cursor="hand2"
        )
        btn_generar.pack(side=tk.LEFT, padx=(20, 5), pady=10)
        
        # Botón limpiar
        btn_limpiar = tk.Button(
            control_frame,
            text="🗑️  Limpiar",
            command=self.limpiar,
            font=("Segoe UI", 11),
            bg=self.colores['bg_input'],
            fg=self.colores['texto'],
            padx=15,
            pady=8,
            border=0,
            cursor="hand2"
        )
        btn_limpiar.pack(side=tk.LEFT, padx=5, pady=10)
        
        # Botón exportar
        btn_exportar = tk.Button(
            control_frame,
            text="💾 Exportar",
            command=self.exportar_txt,
            font=("Segoe UI", 11),
            bg=self.colores['exito'],
            fg="white",
            padx=15,
            pady=8,
            border=0,
            cursor="hand2"
        )
        btn_exportar.pack(side=tk.RIGHT, padx=5, pady=10)
        
        # Frame de información
        info_frame = tk.Frame(main_frame, bg=self.colores['bg_secundario'])
        info_frame.pack(fill=tk.X, pady=(0, 10))
        
        info_text = tk.Label(
            info_frame,
            text="ℹ️  Requisitos: Mínimo 8 caracteres | Combina mayúsculas, minúsculas, números y caracteres especiales",
            font=("Segoe UI", 9),
            bg=self.colores['bg_secundario'],
            fg=self.colores['texto_label'],
            justify=tk.LEFT
        )
        info_text.pack(padx=10, pady=8, anchor=tk.W)
        
        # Área de resultados
        resultados_label = tk.Label(
            main_frame,
            text="Contraseñas Generadas:",
            font=("Segoe UI", 11, "bold"),
            bg=self.colores['bg_principal'],
            fg=self.colores['texto']
        )
        resultados_label.pack(anchor=tk.W, pady=(10, 5))
        
        # ScrolledText para resultados
        self.texto_resultados = scrolledtext.ScrolledText(
            main_frame,
            height=15,
            width=100,
            font=("Consolas", 10),
            bg='#1a1a1a',
            fg=self.colores['texto'],
            insertbackground=self.colores['texto'],
            wrap=tk.WORD
        )
        self.texto_resultados.pack(fill=tk.BOTH, expand=True, pady=(0, 10))
        
        # Configurar tags para colores
        self.texto_resultados.tag_configure("titulo", foreground=self.colores['acento_light'], font=("Consolas", 10, "bold"))
        self.texto_resultados.tag_configure("contraseña", foreground="#00ff00", font=("Consolas", 10, "bold"))
        self.texto_resultados.tag_configure("muy_fuerte", foreground="#4caf50")
        self.texto_resultados.tag_configure("fuerte", foreground="#8bc34a")
        self.texto_resultados.tag_configure("medio", foreground="#ff9800")
        self.texto_resultados.tag_configure("debil", foreground="#f44336")
        self.texto_resultados.tag_configure("estadistica", foreground="#64b5f6")
        
        # Barra de estado
        self.label_estado = tk.Label(
            main_frame,
            text="Listo",
            font=("Segoe UI", 9),
            bg=self.colores['bg_secundario'],
            fg=self.colores['texto_label'],
            justify=tk.LEFT
        )
        self.label_estado.pack(fill=tk.X, pady=(5, 0))
    
    def validar_entrada(self, longitud, cantidad):
        """Valida la entrada del usuario"""
        try:
            longitud = int(longitud)
            cantidad = int(cantidad)
            
            if longitud < self.longitud_minima:
                messagebox.showerror(
                    "Error de Validación",
                    f"La longitud mínima es {self.longitud_minima} caracteres"
                )
                return False, None, None
            
            if cantidad < 1:
                messagebox.showerror(
                    "Error de Validación",
                    "Debe generar al menos 1 contraseña"
                )
                return False, None, None
            
            if cantidad > 1000:
                messagebox.showerror(
                    "Error de Validación",
                    "Máximo 1000 contraseñas"
                )
                return False, None, None
            
            return True, longitud, cantidad
        
        except ValueError:
            messagebox.showerror(
                "Error de Entrada",
                "Debes ingresar números válidos"
            )
            return False, None, None
    
    def generar_contraseña(self, longitud):
        """Genera una contraseña segura"""
        if longitud < self.longitud_minima:
            return None
        
        # Garantizar al menos un carácter de cada tipo
        contraseña = [
            random.choice(self.letras_mayusculas),
            random.choice(self.letras_minusculas),
            random.choice(self.numeros),
            random.choice(self.caracteres_especiales)
        ]
        
        # Llenar con caracteres aleatorios
        caracteres_todos = (
            self.letras_mayusculas + 
            self.letras_minusculas + 
            self.numeros + 
            self.caracteres_especiales
        )
        
        longitud_restante = longitud - len(contraseña)
        contraseña.extend(random.choice(caracteres_todos) for _ in range(longitud_restante))
        
        # Mezclar
        random.shuffle(contraseña)
        
        return ''.join(contraseña)
    
    def calcular_fortaleza(self, contraseña):
        """Calcula la fortaleza de una contraseña"""
        puntuacion = 0
        
        # Longitud
        if len(contraseña) >= 8:
            puntuacion += 10
        if len(contraseña) >= 12:
            puntuacion += 10
        if len(contraseña) >= 16:
            puntuacion += 10
        
        # Tipos de caracteres
        if any(c in self.letras_mayusculas for c in contraseña):
            puntuacion += 10
        if any(c in self.letras_minusculas for c in contraseña):
            puntuacion += 10
        if any(c in self.numeros for c in contraseña):
            puntuacion += 10
        if any(c in self.caracteres_especiales for c in contraseña):
            puntuacion += 20
        
        # Variedad
        especiales_unicos = len(set(c for c in contraseña if c in self.caracteres_especiales))
        if especiales_unicos >= 2:
            puntuacion += 10
        
        # Nivel
        if puntuacion >= 80:
            return "🟢 MUY FUERTE", puntuacion, "muy_fuerte"
        elif puntuacion >= 60:
            return "🟡 FUERTE", puntuacion, "fuerte"
        elif puntuacion >= 40:
            return "🟠 MEDIO", puntuacion, "medio"
        else:
            return "🔴 DÉBIL", puntuacion, "debil"
    
    def generar_contraseñas(self):
        """Genera las contraseñas"""
        # Validar entrada
        valido, longitud, cantidad = self.validar_entrada(
            self.entrada_longitud.get(),
            self.entrada_cantidad.get()
        )
        
        if not valido:
            return
        
        # Generar en thread para no bloquear UI
        thread = threading.Thread(
            target=self._thread_generar,
            args=(longitud, cantidad)
        )
        thread.daemon = True
        thread.start()
    
    def _thread_generar(self, longitud, cantidad):
        """Genera contraseñas en un thread separado"""
        self.label_estado.config(text=f"[*] Generando {cantidad} contraseñas...")
        self.root.update()
        
        self.contraseñas_generadas = []
        for _ in range(cantidad):
            contraseña = self.generar_contraseña(longitud)
            if contraseña:
                self.contraseñas_generadas.append(contraseña)
        
        # Mostrar resultados
        self._mostrar_resultados()
        self.label_estado.config(text=f"✓ Generadas {len(self.contraseñas_generadas)} contraseñas")
    
    def _mostrar_resultados(self):
        """Muestra los resultados en el área de texto"""
        self.texto_resultados.config(state=tk.NORMAL)
        self.texto_resultados.delete(1.0, tk.END)
        
        # Título
        self.texto_resultados.insert(tk.END, "CONTRASEÑAS GENERADAS\n", "titulo")
        self.texto_resultados.insert(tk.END, "»" * 95 + "\n\n")
        
        # Contraseñas
        for i, contraseña in enumerate(self.contraseñas_generadas, 1):
            fortaleza, puntuacion, tag = self.calcular_fortaleza(contraseña)
            
            self.texto_resultados.insert(tk.END, f"{i:3d}. ")
            self.texto_resultados.insert(tk.END, contraseña, "contraseña")
            
            # Botón copiar al lado de cada contraseña
            self.texto_resultados.insert(tk.END, "  ")
            btn_copiar = tk.Button(
                self.texto_resultados,
                text="📋",
                font=("Segoe UI", 8),
                bg=self.colores['bg_secundario'],
                fg=self.colores['texto'],
                command=lambda p=contraseña: self.copiar_una_contraseña(p),
                cursor="hand2",
                padx=2, pady=0, border=0
            )
            self.texto_resultados.window_create(tk.END, window=btn_copiar)
            
            self.texto_resultados.insert(tk.END, f"   |   ")
            self.texto_resultados.insert(tk.END, f"{fortaleza} ({puntuacion}/100)", tag)
            self.texto_resultados.insert(tk.END, "\n")
        
        # Estadísticas
        self.texto_resultados.insert(tk.END, "\n" + "»" * 95 + "\n")
        self.texto_resultados.insert(tk.END, "ESTADÍSTICAS\n", "titulo")
        self.texto_resultados.insert(tk.END, "»" * 95 + "\n")
        
        total_caracteres = sum(len(p) for p in self.contraseñas_generadas)
        longitud_promedio = total_caracteres / len(self.contraseñas_generadas) if self.contraseñas_generadas else 0
        
        mayusculas = sum(len([c for c in p if c in self.letras_mayusculas]) for p in self.contraseñas_generadas)
        minusculas = sum(len([c for c in p if c in self.letras_minusculas]) for p in self.contraseñas_generadas)
        numeros = sum(len([c for c in p if c in self.numeros]) for p in self.contraseñas_generadas)
        especiales = sum(len([c for c in p if c in self.caracteres_especiales]) for p in self.contraseñas_generadas)
        
        self.texto_resultados.insert(
            tk.END,
            f"Total generadas:      {len(self.contraseñas_generadas)}\n",
            "estadistica"
        )
        self.texto_resultados.insert(
            tk.END,
            f"Longitud promedio:    {longitud_promedio:.1f} caracteres\n",
            "estadistica"
        )
        self.texto_resultados.insert(tk.END, f"  • Mayúsculas: {mayusculas}\n", "estadistica")
        self.texto_resultados.insert(tk.END, f"  • Minúsculas: {minusculas}\n", "estadistica")
        self.texto_resultados.insert(tk.END, f"  • Números: {numeros}\n", "estadistica")
        self.texto_resultados.insert(tk.END, f"  • Especiales: {especiales}\n", "estadistica")
        
        self.texto_resultados.config(state=tk.DISABLED)
        self.root.update()
    
    def limpiar(self):
        """Limpia los resultados"""
        self.texto_resultados.config(state=tk.NORMAL)
        self.texto_resultados.delete(1.0, tk.END)
        self.texto_resultados.config(state=tk.DISABLED)
        self.contraseñas_generadas = []
        self.label_estado.config(text="Listo")

    def copiar_una_contraseña(self, password):
        """Copia una sola contraseña al portapapeles"""
        self.root.clipboard_clear()
        self.root.clipboard_append(password)
        self.root.update()
        
        # Notificar en la barra de estado para no interrumpir con muchos popups
        self.label_estado.config(text="📋 Contraseña copiada al portapapeles")
        # Restaurar el texto después de 2 segundos
        self.root.after(2000, lambda: self.label_estado.config(text=f"✓ Generadas {len(self.contraseñas_generadas)} contraseñas") if self.contraseñas_generadas else self.label_estado.config(text="Listo"))
    
    def exportar_txt(self):
        """Exporta las contraseñas a un archivo"""
        if not self.contraseñas_generadas:
            messagebox.showwarning(
                "Sin Datos",
                "Primero debe generar contraseñas"
            )
            return
        
        # Diálogo de guardar
        nombre_archivo = filedialog.asksaveasfilename(
            defaultextension=".txt",
            filetypes=[("Archivos de texto", "*.txt"), ("Todos", "*.*")],
            initialfile=f"contraseñas_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
        )
        
        if not nombre_archivo:
            return
        
        try:
            with open(nombre_archivo, 'w', encoding='utf-8') as f:
                f.write("="*80 + "\n")
                f.write("CONTRASEÑAS GENERADAS\n")
                f.write(f"Generado: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
                f.write("="*80 + "\n\n")
                
                for i, contraseña in enumerate(self.contraseñas_generadas, 1):
                    fortaleza, puntuacion, _ = self.calcular_fortaleza(contraseña)
                    f.write(f"{i:3d}. {contraseña:<30} | {fortaleza} ({puntuacion}/100)\n")
                
                total_caracteres = sum(len(p) for p in self.contraseñas_generadas)
                longitud_promedio = total_caracteres / len(self.contraseñas_generadas)
                
                f.write("\n" + "="*80 + "\n")
                f.write("ESTADÍSTICAS\n")
                f.write("="*80 + "\n")
                f.write(f"Total: {len(self.contraseñas_generadas)}\n")
                f.write(f"Longitud promedio: {longitud_promedio:.1f}\n")
            
            messagebox.showinfo(
                "Éxito",
                f"Archivo guardado:\n{nombre_archivo}"
            )
        
        except Exception as e:
            messagebox.showerror(
                "Error",
                f"Error al guardar: {e}"
            )

if __name__ == "__main__":
    root = tk.Tk()
    app = GeneradorContraseñasUI(root)
    root.mainloop()
