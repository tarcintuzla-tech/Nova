import React, { useMemo, useState } from 'react';
import { Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Card } from './Card';
import { Button } from './Button';
import { Body, Heading, Muted } from './Text';
import { radius } from '../constants/theme';
import { useColors } from '../hooks/useColors';
import { useLang } from '../i18n';
import { pick } from '../content/helpers';
import { QUIZ } from '../content/quizzes';
import { write } from '../hooks/useData';
import { saveQuiz } from '../db/repos/stats';

export function Quiz({ module }: { module: 'learning' | 'people' }) {
  const c = useColors();
  const { t } = useTranslation();
  const lang = useLang();
  const questions = useMemo(() => QUIZ.filter((q) => q.module === module), [module]);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const restart = () => { setI(0); setPicked(null); setScore(0); setFinished(false); };

  if (finished) {
    return (
      <Card>
        <Heading>{t('quiz.score', { score, total: questions.length })}</Heading>
        <Button label={t('quiz.again')} onPress={restart} />
      </Card>
    );
  }
  const q = questions[i];
  const next = () => {
    if (i + 1 >= questions.length) {
      setFinished(true);
      write((db) => saveQuiz(db, module, score, questions.length));
    } else {
      setI(i + 1);
      setPicked(null);
    }
  };
  return (
    <Card>
      <Muted>{t('quiz.progress', { n: i + 1, total: questions.length })}</Muted>
      <Heading>{pick(q.q, lang)}</Heading>
      {q.options.map((o, idx) => {
        const isAnswer = picked !== null && idx === q.answer;
        const isWrong = picked === idx && idx !== q.answer;
        return (
          <Pressable
            key={idx}
            accessibilityRole="button"
            accessibilityLabel={pick(o, lang)}
            disabled={picked !== null}
            onPress={() => { setPicked(idx); if (idx === q.answer) setScore(score + 1); }}
            style={{
              minHeight: 48, justifyContent: 'center', paddingHorizontal: 14, borderRadius: radius.md, borderWidth: 1.5,
              borderColor: isAnswer ? c.accent : isWrong ? c.danger : c.border, backgroundColor: isAnswer ? c.soft : 'transparent',
            }}
          >
            <Body>{pick(o, lang)}</Body>
          </Pressable>
        );
      })}
      {picked !== null ? (
        <>
          <Body style={{ fontWeight: '600' }}>{picked === q.answer ? t('quiz.correct') : t('quiz.wrong')}</Body>
          <Muted>{pick(q.explain, lang)}</Muted>
          <Button label={i + 1 >= questions.length ? t('quiz.finish') : t('common.next')} onPress={next} />
        </>
      ) : null}
    </Card>
  );
}
