
import React from 'react';
import { ExamAnalysisResponse } from '../types';
import { CheckCircle, AlertTriangle, Lightbulb, BookOpen, Star } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface ExamResultProps {
  data: ExamAnalysisResponse;
}

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  return (
    <ReactMarkdown 
      remarkPlugins={[remarkMath]} 
      rehypePlugins={[rehypeKatex]}
      className="markdown-body"
    >
      {content}
    </ReactMarkdown>
  );
};

export const ExamResult: React.FC<ExamResultProps> = ({ data }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">{data.subject}</h2>
            <p className="text-slate-500 font-medium">{data.level || 'Baccalauréat National / Régional'}</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold">
            <Star className="w-4 h-4 fill-emerald-500" />
            Correction Pédagogique Professionnelle
          </div>
        </div>
        <div className="text-slate-600 text-lg">
          <MarkdownRenderer content={data.summary} />
        </div>
      </div>

      {/* Solutions Section */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <BookOpen className="text-blue-600" />
          Solutions Détaillées et Explications
        </h3>
        
        {data.solutions.map((item, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="bg-slate-50 p-4 border-b border-slate-100">
              <span className="text-sm font-bold text-blue-600 mb-1 block">Question {index + 1}</span>
              <div className="font-semibold text-slate-800">
                <MarkdownRenderer content={item.question} />
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex gap-4">
                <div className="mt-1 flex-shrink-0"><CheckCircle className="text-emerald-500 w-5 h-5" /></div>
                <div className="w-full">
                  <h4 className="font-bold text-slate-800 mb-1">Solution Modèle (Étape par étape) :</h4>
                  <div className="text-slate-700 leading-relaxed overflow-x-auto">
                    <MarkdownRenderer content={item.answer} />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50/50 rounded-lg p-4 flex gap-4 border border-blue-100/50">
                <div className="mt-1 flex-shrink-0"><Lightbulb className="text-blue-500 w-5 h-5" /></div>
                <div className="w-full">
                  <h4 className="font-bold text-blue-800 mb-1">Explication Pédagogique :</h4>
                  <div className="text-blue-900 leading-relaxed">
                    <MarkdownRenderer content={item.explanation} />
                  </div>
                </div>
              </div>

              {item.commonMistakes && item.commonMistakes.length > 0 && (
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                  <div className="flex gap-4">
                    <div className="mt-1 flex-shrink-0"><AlertTriangle className="text-amber-500 w-5 h-5" /></div>
                    <div className="w-full">
                      <h4 className="font-bold text-amber-800 mb-1">Erreurs communes à éviter :</h4>
                      <ul className="list-disc list-inside text-amber-900 space-y-1">
                        {item.commonMistakes.map((mistake, i) => (
                          <li key={i}>
                            <MarkdownRenderer content={mistake} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {item.tips && (
                <div className="text-sm text-slate-500 italic border-t pt-3 mt-4">
                  💡 Conseil : <MarkdownRenderer content={item.tips} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Overall Advice */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Star className="w-6 h-6" />
          Conseils de Réussite pour l'Examen National
        </h3>
        <div className="text-blue-50 leading-loose text-lg">
          <MarkdownRenderer content={data.overallAdvice} />
        </div>
      </div>
    </div>
  );
};
