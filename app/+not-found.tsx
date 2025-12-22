import { Link, Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import LocalizedText from '@/components/LocalizedText';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className={styles.container}>
        <LocalizedText className='text-xl font-bold'>{"This screen doesn't exist."}</LocalizedText>
        <Link href="/" className={styles.link}>
          <LocalizedText className={styles.linkText}>Go to home screen!</LocalizedText>
        </Link>
      </View>
    </>
  );
}

const styles = {
  container: `items-center flex-1 justify-center p-5`,
  title: `text-xl font-bold`,
  link: `mt-4 pt-4`,
  linkText: `text-base text-[#2e78b7]`,
};
