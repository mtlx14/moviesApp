import { Text } from 'react-native';
import { styles } from '../style';

export function TextType2({ children, addStyle, ...props }) {
  return (
    <Text key={'text'} style={[styles.textType2, addStyle]} {...props}>
      {children}
    </Text>
  );
}
