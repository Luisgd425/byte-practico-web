# Guía editorial de Byte Práctico

Esta guía asegura que cada artículo sea útil, confiable y con la misma voz. Léela antes de escribir y usa la checklist antes de publicar.

## 1. Tono y voz

- **Cercano y claro.** Habla de "tú". Escribe como le explicarías algo a un amigo listo que no es experto.
- **Práctico primero.** Cada artículo responde a "¿y esto cómo me sirve?". Si no hay una aplicación práctica, replantea el ángulo.
- **Sin humo.** Nada de "revolucionario", "increíble" o "cambiará todo" sin pruebas. Prefiere datos y ejemplos.
- **Honesto.** Di también lo malo, los límites y cuándo NO conviene algo.
- **Español neutro con sabor mexicano.** Evita regionalismos muy marcados y los anglicismos innecesarios. Si usas un término en inglés (prompt, agente, chatbot), explícalo la primera vez.
- Frases cortas. Párrafos de 2 a 4 líneas. Una idea por párrafo.

## 2. Estructura de un artículo

1. **Título** (máx. 70 caracteres para que Google no lo corte): promete un beneficio concreto. Incluye la palabra clave principal.
2. **Descripción** (130-160 caracteres): resume qué gana el lector. Es el texto que aparece en Google.
3. **Entrada** (2-3 párrafos): el problema y la promesa del artículo. Sin introducciones largas.
4. **Cuerpo con subtítulos `##`** cada 150-300 palabras. Usa `###` solo dentro de una sección `##`. Los subtítulos generan la tabla de contenido.
5. **`<Mitad />`** en una línea propia, más o menos a la mitad del texto, entre dos secciones (solo en archivos `.mdx`). Ahí aparece la caja de newsletter y, más adelante, un anuncio.
6. **Cierre:** resumen o siguiente paso concreto. Puede invitar a la newsletter.
7. **Fuentes** en el frontmatter (`sources`), no en el texto.

Longitud: guías y tutoriales de 700 a 1500 palabras; noticias de 300 a 600. La extensión la decide la utilidad, no un número.

Recursos que ayudan: tablas comparativas, listas numeradas para pasos, bloques de código para instrucciones (prompts) que el lector puede copiar, y citas `>` para avisos importantes.

## 3. Frontmatter (la cabecera del archivo)

```yaml
---
title: "Título del artículo"
description: "Descripción de 130-160 caracteres."
pubDate: 2026-11-16
updatedDate: 2026-12-01      # opcional: solo si actualizaste el contenido
author: Luis
category: herramientas-ia    # noticias-ia | herramientas-ia | tutoriales | productividad | gadgets
heroImage: ../../assets/articulos/mi-imagen.jpg
heroAlt: "Descripción de lo que muestra la imagen"
featured: false              # true = aparece como destacado en el inicio
draft: true                  # false = se publica
sources:
  - title: "Nombre de la fuente"
    url: "https://..."
---
```

El nombre del archivo es la URL: `que-es-un-agente-de-ia.mdx` se publica en `/articulos/que-es-un-agente-de-ia/`. Usa minúsculas, guiones y sin acentos ni ñ.

## 4. Cómo citar fuentes

- **Prioridad:** 1) la fuente original (blog oficial de la empresa, comunicado, documentación, estudio); 2) medios reconocidos; 3) nunca otro blog que solo resume.
- **Cada dato concreto** (cifra, fecha, precio, cita) debe poder verificarse en una fuente de la lista.
- **Nunca copies texto literal** de una fuente. Resume con tus palabras. Si citas una frase textual, que sea corta, entre comillas y atribuida.
- En el texto puedes mencionar la fuente de forma natural ("según el blog de Anthropic…") y añadir el enlace.
- Si un dato puede cambiar pronto (precios, límites de planes gratuitos), dilo y recomienda revisar la fuente oficial.

## 5. Cómo añadir experiencia propia (lo más importante)

Google y los lectores premian el contenido de alguien que **de verdad usó** lo que recomienda (la "E" de Experiencia en E-E-A-T). Los borradores, sobre todo los generados con IA, no la tienen: tienes que añadirla tú.

- **Prueba antes de escribir.** Usa la herramienta al menos una vez con un caso real.
- **Cuenta un caso concreto:** "Le subí un PDF de 40 páginas del SAT y en 2 minutos me dio…". Los detalles específicos son la mejor prueba.
- **Incluye capturas de pantalla propias** cuando sea posible (mejor que imágenes de archivo).
- **Da tu opinión con argumentos:** "Para mí, NotebookLM es mejor que ChatGPT para estudiar porque…".
- **Menciona lo que no funcionó.** Da credibilidad.
- En las plantillas, busca los marcadores `[TU EXPERIENCIA]` y `[VERIFICAR]`: no se publica nada con esos textos.

## 6. Uso de IA en la redacción

- La IA puede ayudarte a investigar, ordenar ideas y hacer un primer borrador.
- **Todo artículo publicado debe estar revisado, editado y verificado por ti.** Nada sale automáticamente.
- No publiques en masa. Es mejor un artículo útil al día que diez genéricos: Google y AdSense penalizan el contenido masivo de poco valor.

## 7. Imágenes

- Guárdalas en `src/assets/articulos/`. Formato JPG o PNG, mínimo 1600 px de ancho y proporción 16:9. El sitio las convierte a WebP/AVIF automáticamente.
- Usa imágenes propias, capturas, imágenes con licencia libre (Unsplash, Pexels) o generadas por ti. Nunca imágenes de Google sin permiso.
- El `heroAlt` describe lo que se ve: "Captura de NotebookLM con tres documentos cargados", no "imagen" ni palabras clave sueltas.

## 8. Checklist antes de publicar

- [ ] El título promete algo concreto y tiene menos de 70 caracteres.
- [ ] La descripción tiene entre 130 y 160 caracteres.
- [ ] La categoría es la correcta.
- [ ] Probé lo que recomiendo y añadí mi experiencia propia.
- [ ] No queda ningún `[TU EXPERIENCIA]`, `[VERIFICAR]` ni `[EDITA]`.
- [ ] Cada dato concreto está en una fuente de `sources` y abrí todos los enlaces.
- [ ] No hay texto copiado de otras páginas.
- [ ] La imagen es propia o tiene licencia, y el `heroAlt` la describe.
- [ ] Los subtítulos `##` están en orden y tienen sentido solos.
- [ ] `<Mitad />` está más o menos a la mitad, entre dos secciones.
- [ ] Revisé ortografía (los acentos también cuentan).
- [ ] Lo vi en `npm run dev` en modo claro, oscuro y en celular.
- [ ] Cambié `draft: false` y ajusté `pubDate` a la fecha real de publicación.
