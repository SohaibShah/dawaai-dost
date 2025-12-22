import React, { useMemo, useRef, useState } from 'react';
import { Text, TextProps, GestureResponderEvent, StyleSheet, View } from 'react-native';
import TextTicker from 'react-native-text-ticker';
import { useLocalization } from '@/utils/useLocalization';
import { useTextScale } from '@/utils/useTextScale';
import { TextMagnifierModal } from '@/components/TextMagnifierModal';
import { hapticTap, hapticLongPress } from '@/utils/haptics';

interface LocalizedTextProps extends TextProps {
	children: React.ReactNode;
	interactionMode?: 'passthrough' | 'self';
	enableMagnifier?: boolean;
	enableHaptics?: boolean;
	marquee?: boolean;
	sizeClass?: 'text-xs' | 'text-sm' | 'text-base' | 'text-lg' | 'text-xl' | 'text-2xl' | 'text-3xl' | 'text-4xl';
}

/**
 * Localized text with:
 * - language-aware font
 * - text scaling via sizeClass or numeric fontSize
 * - haptics on press/long-press
 * - long-press magnifier
 * - optional marquee for truncated single-line text
 */
export default function LocalizedText({
	style,
	interactionMode,
	enableMagnifier = true,
	enableHaptics = true,
	marquee = true,
	sizeClass,
	...props
}: LocalizedTextProps) {
	const { getFontFamily, isUrdu } = useLocalization();
	const { getScaleMultiplier, getScaledSize } = useTextScale();

	const [magnifierText, setMagnifierText] = useState<string | null>(null);

	const fontFamily = getFontFamily();
	const scaleMultiplier = getScaleMultiplier();

	const flattenedStyle = useMemo(() => StyleSheet.flatten(style) || {}, [style]);
	const baseFontSize = sizeClass
		? getScaledSize(sizeClass)
		: typeof flattenedStyle.fontSize === 'number'
			? flattenedStyle.fontSize
			: 16;
	const scaledFontSize = getScaledSize(baseFontSize);
	const computedLineHeight = typeof flattenedStyle.lineHeight === 'number'
		? getScaledSize(flattenedStyle.lineHeight)
		: Math.round(scaledFontSize * 1.4);

	// Let parent control alignment; keep layout props for width/flex
	const containerStyle = useMemo(() => {
		const s: any = {};
		if (flattenedStyle && Object.prototype.hasOwnProperty.call(flattenedStyle, 'width')) s.width = (flattenedStyle as any).width;
		if (Object.prototype.hasOwnProperty.call(flattenedStyle, 'maxWidth')) s.maxWidth = (flattenedStyle as any).maxWidth;
		if (Object.prototype.hasOwnProperty.call(flattenedStyle, 'minWidth')) s.minWidth = (flattenedStyle as any).minWidth;
		if (Object.prototype.hasOwnProperty.call(flattenedStyle, 'flex')) s.flex = (flattenedStyle as any).flex;
		if (Object.prototype.hasOwnProperty.call(flattenedStyle, 'flexGrow')) s.flexGrow = (flattenedStyle as any).flexGrow;
		if (Object.prototype.hasOwnProperty.call(flattenedStyle, 'flexShrink')) s.flexShrink = (flattenedStyle as any).flexShrink;
		if (Object.prototype.hasOwnProperty.call(flattenedStyle, 'flexBasis')) s.flexBasis = (flattenedStyle as any).flexBasis;
		return s;
	}, [flattenedStyle]);

	const flattenText = useMemo(() => {
		if (!props.children) return '';
		return React.Children.toArray(props.children)
			.map((child) => (typeof child === 'string' ? child : ''))
			.filter(Boolean)
			.join(' ')
			.trim();
	}, [props.children]);

	const triggerMagnifier = () => {
		if (!enableMagnifier) return;
		if (flattenText.length > 0) setMagnifierText(flattenText);
	};

	// Touch tracking to enable haptics/magnifier without intercepting parent touchables
	const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const longPressTriggeredRef = useRef<boolean>(false);
	const [suppressParentLongPress, setSuppressParentLongPress] = useState<boolean>(false);

	// Pre-empt RN default long-press (~500ms) to show magnifier earlier and suppress parent onLongPress.
	const LONG_PRESS_MS = 400;

	const onTouchStart = (e: GestureResponderEvent) => {
		// Fire lightweight tap haptic immediately
		if (enableHaptics) hapticTap();

		// Schedule long press actions (magnifier + heavy haptic)
		longPressTriggeredRef.current = false;
		if (enableMagnifier) {
			longPressTimerRef.current = setTimeout(() => {
				longPressTriggeredRef.current = true;
				if (enableHaptics) hapticLongPress();
				triggerMagnifier();
				// Temporarily disable pointer events so parent Touchable doesn't receive onLongPress.
				setSuppressParentLongPress(true);
			}, LONG_PRESS_MS);
		}

		// Allow parent touchables to handle presses – do not prevent propagation
		props.onPressIn?.(e);
	};

	const clearLongPressTimer = () => {
		if (longPressTimerRef.current) {
			clearTimeout(longPressTimerRef.current);
			longPressTimerRef.current = null;
		}
	};

	const onTouchEnd = (e: GestureResponderEvent) => {
		clearLongPressTimer();
		setSuppressParentLongPress(false);
		// If not long-pressed, it was a regular tap – parent will receive onPress
		// Forward any local onPress if provided explicitly
		if (!longPressTriggeredRef.current) {
			props.onPress?.(e);
		}
	};

	const onTouchCancel = () => {
		clearLongPressTimer();
	};

	// Default to passthrough to ensure parent TouchableOpacity handles interactions
	const resolvedInteractionMode: 'passthrough' | 'self' = interactionMode || 'passthrough';
	const resolvedNumberOfLines = props.numberOfLines ?? 1;

	const commonStyle = [
		style,
		{
			fontSize: scaledFontSize,
			lineHeight: computedLineHeight,
			writingDirection: isUrdu ? 'rtl' as 'rtl' : 'ltr' as 'ltr',
		},
		fontFamily ? { fontFamily } : {},
		isUrdu ? { includeFontPadding: false } : {},
	];

	const baseProps = {
		allowFontScaling: true,
		maxFontSizeMultiplier: scaleMultiplier,
		// Do not attach onPress/onLongPress here by default to avoid intercepting parent touchables.
		// When explicitly set to `interactionMode="self"`, we attach them below.
	} as TextProps;

	const selfModePressProps: Partial<TextProps> = resolvedInteractionMode === 'self'
		? {
			onPress: (e: GestureResponderEvent) => {
				if (enableHaptics) hapticTap();
				props.onPress?.(e);
			},
			onLongPress: (e: GestureResponderEvent) => {
				if (enableHaptics) hapticLongPress();
				triggerMagnifier();
				props.onLongPress?.(e);
			},
		  }
		: {};

	return (
		<>
			<View
				style={containerStyle}
				// Use raw touch events to run haptics/magnifier but let parent touchables handle presses
				onTouchStart={onTouchStart}
				onTouchEnd={onTouchEnd}
				onTouchCancel={onTouchCancel}
				pointerEvents={suppressParentLongPress ? 'none' : 'auto'}
			>
				{marquee ? (
					<TextTicker
						{...props}
						{...baseProps}
						{...selfModePressProps}
						numberOfLines={1}
						style={commonStyle}
						duration={12000}
						loop
						bounce={false}
						repeatSpacer={40}
						marqueeDelay={200}
						isRTL={isUrdu}
					>
						{props.children}
					</TextTicker>
				) : (
					<Text
						{...props}
						{...baseProps}
						{...selfModePressProps}
						numberOfLines={resolvedNumberOfLines}
						ellipsizeMode={props.ellipsizeMode ?? 'tail'}
						style={commonStyle}
					>
						{props.children}
					</Text>
				)}
			</View>

			<TextMagnifierModal
				visible={!!magnifierText}
				text={magnifierText || ''}
				onClose={() => setMagnifierText(null)}
			/>
		</>
	);
}

