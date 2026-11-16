import React from 'react';
import { TextInput, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Button } from './Button';
import { Muted } from './Text';
import { font, radius } from '../constants/theme';
import { useColors } from '../hooks/useColors';
import { textSchema } from '../utils/validation';

type Props = {
  placeholder: string; submitLabel: string; max: number; multiline?: boolean; optional?: boolean;
  initial?: string; resetOnSubmit?: boolean; onSubmit: (value: string) => Promise<unknown> | void;
  onCancel?: () => void; cancelLabel?: string;
};

export function QuickForm({ placeholder, submitLabel, max, multiline, optional, initial = '', resetOnSubmit = true, onSubmit, onCancel, cancelLabel }: Props) {
  const c = useColors();
  const { t } = useTranslation();
  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<{ value: string }>({
    resolver: zodResolver(textSchema(max, optional)),
    defaultValues: { value: initial },
  });
  const submit = handleSubmit(async ({ value }) => {
    await onSubmit(value.trim());
    if (resetOnSubmit) reset({ value: '' });
  });
  return (
    <View style={{ gap: 8 }}>
      <Controller
        control={control}
        name="value"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            placeholderTextColor={c.muted}
            accessibilityLabel={placeholder}
            multiline={multiline}
            textAlignVertical={multiline ? 'top' : 'center'}
            style={{
              minHeight: multiline ? 110 : 48, borderRadius: radius.md, backgroundColor: c.bg, color: c.text,
              paddingHorizontal: 14, paddingVertical: multiline ? 12 : 8, fontSize: font.body,
            }}
          />
        )}
      />
      {errors.value?.message ? <Muted style={{ color: c.danger }}>{t(errors.value.message, { max })}</Muted> : null}
      <Button label={submitLabel} onPress={submit} disabled={isSubmitting} />
      {onCancel ? <Button variant="ghost" label={cancelLabel ?? t('common.cancel')} onPress={onCancel} /> : null}
    </View>
  );
}
