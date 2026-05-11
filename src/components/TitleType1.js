import { Text } from 'react-native';
import { styles } from '../style';

export function TitleType1({ addStyle, children }) {
  return <Text style={[styles.titleType1, addStyle]}>{children}</Text>;
}
