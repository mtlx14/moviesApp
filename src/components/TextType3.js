import { Text } from 'react-native';
import { styles } from '../style';

export function TextType3({ children, addStyle, ...props }) {
  return (
    <Text style={[styles.textType3, addStyle]} {...props}>
      {children}
    </Text>
  );
}
