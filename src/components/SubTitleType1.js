import { Text } from 'react-native';
import { styles } from '../style';

export function SubTitleType1({ children, addStyle, ...props }) {
  return (
    <Text style={[styles.subTitleType1, addStyle]} {...props}>
      {children}
    </Text>
  );
}
