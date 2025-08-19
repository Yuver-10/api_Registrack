# 📋 Ejemplos de Solicitudes para Postman

## 🚨 Solución a Errores Comunes

### **Error 1: "Ya existe una solicitud para este cliente y servicio"**
**Causa:** Intentas crear una solicitud duplicada
**Solución:** Cambiar `id_servicio` o usar valores dinámicos

### **Error 2: "Check constraint 'chk_ordenes_estado' is violated"**
**Causa:** El valor del campo `estado` no es válido
**Solución:** Usar estados válidos en MAYÚSCULAS

## ✅ Ejemplos de JSON Válidos

### **Ejemplo 1: Solicitud Básica**
```json
{
  "id_cliente": {{user_id}},
  "id_servicio": 1,
  "id_empresa": 1,
  "total_estimado": 150000,
  "pais": "Colombia",
  "ciudad": "Bogotá",
  "codigo_postal": "110111",
  "estado": "PENDIENTE",
  "numero_expediente": "EXP-2024-001"
}
```

### **Ejemplo 2: Con Valores Dinámicos (Recomendado)**
```json
{
  "id_cliente": {{user_id}},
  "id_servicio": {{$randomInt}},
  "id_empresa": 1,
  "total_estimado": {{$randomInt}},
  "pais": "Colombia",
  "ciudad": "Bogotá",
  "codigo_postal": "110111",
  "estado": "PENDIENTE",
  "numero_expediente": "EXP-{{$timestamp}}-{{$randomInt}}"
}
```

### **Ejemplo 3: Diferentes Estados Válidos**

#### **Estado: EN_PROCESO**
```json
{
  "id_cliente": {{user_id}},
  "id_servicio": 2,
  "id_empresa": 1,
  "total_estimado": 200000,
  "pais": "Colombia",
  "ciudad": "Medellín",
  "codigo_postal": "050001",
  "estado": "EN_PROCESO",
  "numero_expediente": "EXP-2024-002"
}
```

#### **Estado: COMPLETADO**
```json
{
  "id_cliente": {{user_id}},
  "id_servicio": 3,
  "id_empresa": 1,
  "total_estimado": 300000,
  "pais": "Colombia",
  "ciudad": "Cali",
  "codigo_postal": "760001",
  "estado": "COMPLETADO",
  "numero_expediente": "EXP-2024-003"
}
```

#### **Estado: CANCELADO**
```json
{
  "id_cliente": {{user_id}},
  "id_servicio": 4,
  "id_empresa": 1,
  "total_estimado": 100000,
  "pais": "Colombia",
  "ciudad": "Barranquilla",
  "codigo_postal": "080001",
  "estado": "CANCELADO",
  "numero_expediente": "EXP-2024-004"
}
```

## 🔧 Estados Válidos Confirmados

- ✅ `"PENDIENTE"`
- ✅ `"EN_PROCESO"`
- ✅ `"COMPLETADO"`
- ✅ `"CANCELADO"`
- ✅ `"RECHAZADO"`
- ✅ `"APROBADO"`

## 🎲 Variables Dinámicas de Postman

### **Para Evitar Duplicados:**
- `{{$randomInt}}` - Número entero aleatorio
- `{{$timestamp}}` - Timestamp actual
- `{{$guid}}` - GUID único
- `{{$randomUUID}}` - UUID aleatorio

### **Ejemplo con Todas las Variables:**
```json
{
  "id_cliente": {{user_id}},
  "id_servicio": {{$randomInt}},
  "id_empresa": {{$randomInt}},
  "total_estimado": {{$randomInt}},
  "pais": "Colombia",
  "ciudad": "{{$randomCity}}",
  "codigo_postal": "{{$randomInt}}",
  "estado": "PENDIENTE",
  "numero_expediente": "EXP-{{$timestamp}}-{{$randomUUID}}"
}
```

## 🛠️ Soluciones Rápidas

### **Si sigues teniendo errores:**

1. **Cambiar manualmente los valores:**
   ```json
   {
     "id_servicio": 999,  // ← Número alto único
     "numero_expediente": "EXP-UNIQUE-001"  // ← Texto único
   }
   ```

2. **Usar timestamp para unicidad:**
   ```json
   {
     "id_servicio": 1001,
     "numero_expediente": "EXP-20241201-001"
   }
   ```

3. **Verificar que el servicio existe:**
   - Asegúrate de que `id_servicio` existe en la tabla `servicios`
   - Usa valores como 1, 2, 3 que probablemente existan

## 📝 Notas Importantes

- **Estados en MAYÚSCULAS:** Siempre usa estados en mayúsculas
- **IDs únicos:** Cada combinación `id_cliente` + `id_servicio` debe ser única
- **Números válidos:** Los IDs deben ser números enteros positivos
- **Textos no vacíos:** Todos los campos de texto deben tener contenido

## 🔄 Proceso de Prueba Recomendado

1. **Usar la colección actualizada** con valores dinámicos
2. **Si falla:** Cambiar manualmente `id_servicio`
3. **Si sigue fallando:** Cambiar `estado` a "PENDIENTE"
4. **Último recurso:** Usar valores completamente únicos

¡Con estos ejemplos deberías poder crear solicitudes sin errores! 🚀