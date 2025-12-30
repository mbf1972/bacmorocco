import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { FileData } from "../types";

const SYSTEM_INSTRUCTION = `
Vous êtes un tuteur expert du Baccalauréat Marocain (Option Français/BIOF). Votre mission est de résoudre les examens nationaux et régionaux avec la rigueur et le formatage exact attendus dans les lycées marocains.

RÈGLES CRITIQUES POUR LES MATHÉMATIQUES ET LES SCIENCES :
1. LATEX POUR TOUTES LES FORMULES : Utilisez systématiquement LaTeX pour chaque expression mathématique. Utilisez $...$ pour les formules en ligne et $$...$$ pour les blocs.
   Exemple : Écrivez "$f(x) = \frac{\ln x}{x}$" au lieu de "f(x) = (ln x)/x".
2. SOLUTIONS DÉTAILLÉES LIGNE PAR LIGNE : 
   - Chaque étape de calcul doit être sur une nouvelle ligne.
   - NE JAMAIS donner deux réponses ou deux étapes sur la même ligne.
   - Pour les limites, détaillez chaque levée d'indétermination étape par étape.
   - Pour les intégrales ou dérivées, montrez chaque transformation intermédiaire.
3. NORMES MAROCAINES : 
   - Utilisez les notations standards ($\mathbb{R}$, $\forall$, $\exists$, etc.).
   - Justifiez chaque résultat par la propriété du cours correspondante.
4. LANGUE ET PÉDAGOGIE :
   - Utilisez un français scientifique précis.
   - Expliquez la "Méthodologie" (comment aborder la question) avant de donner la solution.
   - Citez la partie du "Cadre Référentiel" concernée par la question.
`;

export const analyzeExamFile = async (file: FileData) => {
  const genAI = new GoogleGenerativeAI(process.env.API_KEY || process.env.GEMINI_API_KEY || "");
  
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    systemInstruction: SYSTEM_INSTRUCTION
  });

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              data: file.base64,
              mimeType: file.mimeType,
            },
          },
          { text: "Analysez ce sujet d'examen du Baccalauréat Marocain. Veuillez fournir des solutions détaillées en utilisant un formatage LaTeX de haute qualité. Assurez-vous que chaque étape de la solution est sur une ligne séparée et correspond aux standards de correction du Bac Maroc BIOF." }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          subject: { type: SchemaType.STRING },
          level: { type: SchemaType.STRING },
          summary: { type: SchemaType.STRING },
          solutions: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                question: { type: SchemaType.STRING },
                answer: { type: SchemaType.STRING },
                explanation: { type: SchemaType.STRING },
                commonMistakes: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                tips: { type: SchemaType.STRING }
              },
              required: ["question", "answer", "explanation"]
            }
          },
          overallAdvice: { type: SchemaType.STRING }
        },
        required: ["subject", "solutions", "overallAdvice"]
      }
    }
  });

  const response = result.response;
  return JSON.parse(response.text() || '{}');
};

