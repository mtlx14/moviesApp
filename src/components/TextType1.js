import { Text } from 'react-native';
import { styles } from '../style';

export function TextType1({ children, color, addStyle, ...props }) {
  let addColor = color ? { color: color } : '';
  return (
    <Text style={[styles.textType1, addColor, addStyle]} {...props}>
      {children}
    </Text>
  );
}
