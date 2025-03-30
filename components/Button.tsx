import { forwardRef } from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';

type ButtonProps = {
  title: string;
} & TouchableOpacityProps;

export const Button = forwardRef<View, ButtonProps>(({ title, ...touchableProps }, ref) => {
  return (
    <TouchableOpacity
      ref={ref}
      {...touchableProps}
      className={`${styles.button} ${touchableProps.className}`}>
      <Text adjustsFontSizeToFit numberOfLines={1} className={styles.buttonText}>
        {title}
      </Text>
    </TouchableOpacity>
  );
});

const styles = {
  button: 'items-center justify-center bg-indigo-500 rounded-[28px] shadow-md flex',
  buttonText: 'text-white text-lg font-semibold text-center flex',
};
