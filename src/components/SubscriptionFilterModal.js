import { useEffect, useState } from 'react';
import { Dimensions, Image, Modal, Pressable, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { TextType1 } from './TextType1';
import { TextType2 } from './TextType2';
import { backgrounds, logosSrc } from './ProviderTag';
import { constantsAndInfo } from '../constantsAndInfo';
import { CheckIcon } from '../SVGS';
import { useMyProviders } from '../myProviders';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const CARD_WIDTH = (windowWidth - 40 - 40 - 10) / 2;
// cards chicas de "Otras plataformas", 3 por fila
const SMALL_CARD_WIDTH = (windowWidth - 40 - 40 - 20) / 3;

const providerKey = (name) => constantsAndInfo.providersNames[name.toLowerCase().replaceAll(' ', '_')];

// por defecto muestra mis suscripciones (filtro de playlists); en Perfil se usa con todas las disponibles
export function SubscriptionFilterModal({ visible, selected, onChange, onClose, options, title = 'Suscripciones', subtitle = 'Mostrar solo películas disponibles en:' }) {
  const myProviders = useMyProviders();
  const providers = options ?? myProviders;
  // en el filtro de playlists se muestran aparte las plataformas disponibles que no son mis suscripciones
  const otherProviders = options ? [] : constantsAndInfo.allProviders.filter((name) => !myProviders.includes(name));
  // la selección se edita en un borrador y solo se aplica al presionar "Listo"
  const [draft, setDraft] = useState(selected);
  useEffect(() => {
    if (visible) setDraft(selected);
  }, [visible]);

  const toggleProvider = (name) => {
    Haptics.selectionAsync();
    setDraft((prev) => (prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]));
  };
  const applyAndClose = () => {
    onChange(draft);
    onClose();
  };

  const renderCard = (name, width, height, logoHeight) => {
    const key = providerKey(name);
    const isSelected = draft.includes(name);
    return (
      <Pressable
        key={name}
        onPress={() => toggleProvider(name)}
        style={{
          width,
          height,
          borderRadius: 12,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* el fondo y el logo tienen opacidades separadas */}
        <View style={[StyleSheet.absoluteFill, { backgroundColor: backgrounds[key] || backgrounds.noImg, opacity: isSelected ? 1 : 0.8 }]} />
        <Image source={logosSrc[key] || logosSrc.noImg} style={{ height: logoHeight, width: width - 40, resizeMode: 'contain', opacity: isSelected ? 1 : 0.9 }} />
        {/* mismo círculo con check que en las listas de películas del cast */}
        {isSelected && (
          <Animated.View
            entering={FadeInDown.duration(150)}
            exiting={FadeOutDown.duration(150)}
            style={{
              position: 'absolute',
              bottom: 6,
              right: 6,
              width: 20,
              height: 20,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckIcon width={10} height={10} fill="#ffffffE6" />
          </Animated.View>
        )}
      </Pressable>
    );
  };

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <View style={[StyleSheet.absoluteFill, { justifyContent: 'center', paddingHorizontal: 20 }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <Animated.View
          style={{ borderRadius: 20, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,.1)', padding: 20, paddingTop: 32, minHeight: windowHeight * 0.5 }}
          entering={FadeInDown.duration(200)}
        >
          <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill} />
          <TextType1 addStyle={{ fontSize: 20 }}>{title}</TextType1>
          <TextType2 addStyle={{ fontSize: 14, marginTop: 4 }}>{subtitle}</TextType2>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 28 }}>{providers.map((name) => renderCard(name, CARD_WIDTH, 56, 20))}</View>

          {otherProviders.length > 0 && (
            <>
              <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,.15)', marginTop: 20 }} />
              <TextType2 addStyle={{ fontSize: 14, marginTop: 16 }}>Otras plataformas:</TextType2>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 }}>{otherProviders.map((name) => renderCard(name, SMALL_CARD_WIDTH, 44, 16))}</View>
            </>
          )}

          {/* el botón queda a 10px de los bordes del panel (lados y abajo), con radio concéntrico: 20 del panel - 10 = 10 */}
          <View style={{ marginTop: 'auto', paddingTop: 20, marginHorizontal: -10, marginBottom: -10 }}>
            <Pressable onPress={applyAndClose} style={{ borderRadius: 10, overflow: 'hidden', backgroundColor: 'rgba(0,0,0,.2)', height: 50, alignItems: 'center', justifyContent: 'center' }}>
              <TextType1 addStyle={{ fontSize: 15 }}>Listo</TextType1>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
