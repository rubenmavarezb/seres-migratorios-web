// src/content.config.ts
import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/* --------------------------------------------------------------------------
   Helpers
   -------------------------------------------------------------------------- */

// Required bilingual field. When a translation is still missing, write
// "[EN PENDIENTE]" in `en`: better than leaving Spanish on an English page.
const bilingue = z.object({
  es: z.string().min(1),
  en: z.string().min(1),
});

// Instagram handle, written exactly as it appears on the pieces, with the at sign.
const handle = z.string().regex(/^@[\w.]+$/, 'El handle va con arroba: @ejemplo');

// zod 4 (the version `astro/zod` re-exports in Astro 7) validates URLs with
// `z.url()`. `z.string().url()` still works but is deprecated, so the form the
// content model kept "for compatibility" is not used here — see
// docs/notas-astro-7.md.
const url = z.url();

// A visible placeholder between square brackets is VALID content: the project's
// golden rule forbids inventing data, so the schema accepts "[DATO PENDIENTE]"
// wherever there is no real value yet. Backlog task SM-068 checks that no
// placeholder is left in production.
const PLACEHOLDER = /^\[[^\]]+\]$/;
const oPlaceholder = <T extends z.ZodType>(schema: T) =>
  z.union([schema, z.string().regex(PLACEHOLDER)]);

/* --------------------------------------------------------------------------
   Closed value lists

   Kept as `as const` arrays so the schemas below and the types exported at the
   end of the file share a single source of truth.
   -------------------------------------------------------------------------- */

const ROLES = ['fotea', 'expone', 'film', 'musica'] as const;
const ESTADOS_EDICION = ['proxima', 'pasada'] as const;
const TIPOS_ALIADO = ['espacio', 'organizacion', 'marca', 'medio', 'otro'] as const;
const DISCIPLINAS = ['fotografia', 'film', 'musica', 'otro'] as const;

/* --------------------------------------------------------------------------
   artistas (fotean, exponen, film, música: one entry per person)
   -------------------------------------------------------------------------- */

const artistas = defineCollection({
  loader: glob({ base: './src/content/artistas', pattern: '**/[^_]*.md' }),
  schema: ({ image }) =>
    z.object({
      // Set number along the itinerary ("001"-"007"). Optional: whoever only
      // exhibits or only plays has no number assigned.
      numero: z
        .string()
        .regex(/^\d{3}$/)
        .optional(),
      nombre: z.string().min(1),
      slug: z.string().regex(/^[a-z0-9-]+$/),
      instagram: oPlaceholder(handle).optional(),
      ciudad: z.string(),
      pais: z.string(),
      // Roles (one person can hold several: Angela Pérez and Leo Simmons both
      // shoot and exhibit). The concrete participation in each edition is set by
      // the `fotean` / `exponen` / `musica` lists of the `ediciones` collection.
      roles: z.array(z.enum(ROLES)).min(1),
      // Portrait, handwritten quote and signature are optional: when they are
      // missing, the block is not rendered.
      retrato: image().optional(),
      retratoAlt: bilingue,
      obra: z
        .array(
          z.object({
            image: image(),
            alt: bilingue,
            titulo: bilingue.optional(),
            lugar: z.string().optional(),
            anio: z.number().int().optional(),
          })
        )
        .default([]),
      // The author's own quote. In EN it is shown as a translation below the scan.
      frase: bilingue,
      // Scan of the real handwriting. When missing, it falls back to text in font-manuscrita.
      fraseManuscrita: image().optional(),
      firma: image().optional(),
      ediciones: z.array(reference('ediciones')).default([]),
      // Manual order in the index; when missing, entries are sorted by `numero`
      // and then by name.
      orden: z.number().int().optional(),
      borrador: z.boolean().default(false),
    }),
});

/* --------------------------------------------------------------------------
   ediciones
   -------------------------------------------------------------------------- */

const ediciones = defineCollection({
  loader: glob({ base: './src/content/ediciones', pattern: '**/[^_]*.md' }),
  schema: ({ image }) =>
    z.object({
      slug: z.string().regex(/^[a-z0-9-]+$/),
      nombre: z.string().min(1),
      ciudad: z.string(),
      pais: z.string(),
      fecha: z.coerce.date(),
      horario: z.object({
        desde: z.string().regex(/^\d{2}:\d{2}$/),
        hasta: z.string().regex(/^\d{2}:\d{2}$/),
        etiqueta: z.string(), // as shown inside the BloqueFicha
      }),
      lugar: z.object({
        nombre: z.string(),
        direccion: z.string(),
        instagram: oPlaceholder(handle).optional(),
      }),
      // There is a single `proxima` edition at a time: it is the one in the
      // BloqueFicha of the home page.
      estado: z.enum(ESTADOS_EDICION),
      claim: bilingue,
      descripcion: bilingue,
      fotean: z.array(reference('artistas')).default([]),
      exponen: z.array(reference('artistas')).default([]),
      musica: z
        .array(
          z.object({
            nombre: z.string(),
            instagram: oPlaceholder(handle).optional(),
          })
        )
        .default([]),
      aliados: z.array(reference('aliados')).default([]),
      galeria: z
        .array(
          z.object({
            image: image(),
            alt: bilingue,
            credito: z.string().optional(),
          })
        )
        .default([]),
      // Data consumed by the Sello component. Written with its real
      // capitalization: Sello.astro applies `uppercase`, like the rest of the
      // content (see CLAUDE.md, "Mayúsculas solo con text-transform").
      sello: z.object({
        ciudad: z.string(), // e.g. "Buenos Aires"
        fechaCorta: z.string(), // e.g. "08 ago 2026"
      }),
      // Data consumed by the SelloHorario component.
      selloHorario: z
        .object({ desde: z.string(), hasta: z.string(), fechaCorta: z.string() })
        .optional(),
      linkConvocatoria: z.string().optional(),
      imagenOg: image().optional(),
    }),
});

/* --------------------------------------------------------------------------
   aliados
   -------------------------------------------------------------------------- */

const aliados = defineCollection({
  loader: glob({ base: './src/content/aliados', pattern: '**/[^_]*.md' }),
  schema: ({ image }) =>
    z.object({
      slug: z.string().regex(/^[a-z0-9-]+$/),
      nombre: z.string().min(1),
      // Monochrome SVG, ready to be painted in azul-sello. The single exception
      // to the monochrome rule is the tricolor hands logo.
      logo: image(),
      logoAlt: bilingue,
      logoColor: z.boolean().default(false),
      url: oPlaceholder(url).optional(),
      instagram: oPlaceholder(handle).optional(),
      tipo: z.enum(TIPOS_ALIADO),
      confirmado: z.boolean().default(true),
    }),
});

/* --------------------------------------------------------------------------
   convocatorias
   -------------------------------------------------------------------------- */

const convocatorias = defineCollection({
  loader: glob({ base: './src/content/convocatorias', pattern: '**/[^_]*.md' }),
  schema: z.object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    // Optional: an open call can start before the markdown of its edition
    // exists. Meanwhile `edicionNombre` is shown.
    edicion: reference('ediciones').optional(),
    edicionNombre: z.string(),
    abierta: z.boolean(),
    apertura: oPlaceholder(z.coerce.date()).optional(),
    cierre: oPlaceholder(z.coerce.date()).optional(),
    titulo: bilingue,
    texto: bilingue,
    requisitos: z.array(bilingue).default([]),
    disciplinas: z.array(z.enum(DISCIPLINAS)).default([...DISCIPLINAS]),
    // Netlify Forms identifies the form by its `name` in the HTML, not by an
    // endpoint: there is no URL to store and no environment variable to load.
    // This is the Spanish name. English uses open-call: Netlify associates one
    // success page with each name (Ruben decision, 08.09.2026; SM-054).
    formNombre: z.string().default('convocatoria'),
  }),
});

export const collections = { artistas, ediciones, aliados, convocatorias };

/* --------------------------------------------------------------------------
   Types derived from the closed value lists above.

   `export type` is erased at compile time, so these exports cannot interfere
   with Astro reading the `collections` export from this file.
   -------------------------------------------------------------------------- */

export type Rol = (typeof ROLES)[number];
export type EstadoEdicion = (typeof ESTADOS_EDICION)[number];
export type TipoAliado = (typeof TIPOS_ALIADO)[number];
export type Disciplina = (typeof DISCIPLINAS)[number];
