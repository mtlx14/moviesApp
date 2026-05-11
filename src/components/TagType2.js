import { Text, View, Image } from 'react-native';
import { styles } from '../style';
import { BlurView } from 'expo-blur';

const colors = {
  green: { background: 'rgba(0, 248, 124, 0.2)', color: 'rgba(255, 255, 255, 0.7)' },
  purple: { background: 'rgba(255, 0, 111, 0.3)', color: 'rgba(255, 255, 255, .7)' },
  blue: { background: 'rgba(0, 72, 255, 0.3)', color: 'rgba(255, 255, 255, .7)' },
};
let color = '';

export function TagType2({ children, addStyle, type, ...props }) {
  color = type === 'Colección' ? 'purple' : type === 'Director' ? 'blue' : type === 'Relacionados' && 'green';

  let colorStyle = color ? { backgroundColor: { backgroundColor: colors[color].background }, color: { color: colors[color].color } } : '';
  return (
    <View style={[addStyle, colorStyle.backgroundColor, { flexDirection: 'row', gap: 2, alignItems: 'center', justifyContent: 'center', borderRadius: 4, overflow: 'hidden', height: 18 }]}>
      <BlurView style={{ width: '100%', height: '100%', position: 'absolute' }} intensity={20}></BlurView>
      <Text style={[colorStyle.color, { fontSize: 14, marginHorizontal: 5 }]}>{type}</Text>
    </View>
  );
}
