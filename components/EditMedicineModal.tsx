// import React, { useState, useEffect } from 'react';
// import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView, Platform } from 'react-native';
// import { MotiView } from 'moti';
// import { X, Save, Clock, Minus, Plus, Trash, Volume2 } from 'lucide-react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { useStore, Medicine } from '@/store/useStore';
// import { VoiceService } from '@/services/VoiceService';

// interface Props {
//     visible: boolean;
//     med: Medicine | null;
//     onClose: () => void;
// }

// export default function EditMedicineModal({ visible, med, onClose }: Props) {
//     const updateMedicine = useStore(state => state.updateMedicine);
//     const removeMedicine = useStore(state => state.removeMedicine);

//     // Local Form State
//     const [stock, setStock] = useState('');
//     const [name, setName] = useState('');
//     const [timeSlots, setTimeSlots] = useState<Date[]>([]);
//     const [showPickerIndex, setShowPickerIndex] = useState<number | null>(null);

//     useEffect(() => {
//         if (med) {
//             setName(med.name);
//             setStock(med.stock.toString());

//             // ROBUST PARSING: Convert "8:00 AM" strings back to Date objects
//             const dates = med.timeSlots.map(t => {
//                 // Use the regex logic similar to VoiceService to ensure accuracy
//                 const d = new Date();
//                 const match = t.match(/(\d+):(\d+)\s?(AM|PM)?/i);
//                 if (match) {
//                     let hours = parseInt(match[1], 10);
//                     const minutes = parseInt(match[2], 10);
//                     const period = match[3]?.toUpperCase();
//                     if (period === 'PM' && hours < 12) hours += 12;
//                     if (period === 'AM' && hours === 12) hours = 0;
//                     d.setHours(hours, minutes, 0, 0);
//                 }
//                 return d;
//             });
//             setTimeSlots(dates);
//         }
//     }, [med]);

//     const onDelete = () => {
//         removeMedicine(med!.id);
//         onClose();
//     }

//     const handleSave = () => {
//         if (!med) return;

//         // Convert Dates back to "8:00 AM" strings
//         const formattedTimes = timeSlots.map(d => VoiceService.formatTime({ time: d }));

//         updateMedicine(med.id, {
//             name,
//             stock: parseInt(stock) || 0,
//             timeSlots: formattedTimes
//         });

//         onClose();
//     };

//     const handleTimeChange = (event: any, selectedDate?: Date, index: number = 0) => {
//         if (Platform.OS === 'android') setShowPickerIndex(null); // Close picker on Android
//         if (selectedDate) {
//             const newSlots = [...timeSlots];
//             newSlots[index] = selectedDate;
//             setTimeSlots(newSlots);
//         }
//     };

//     if (!visible || !med) return null;

//     return (
//         <Modal visible={visible} transparent animationType="slide">
//             <View className="flex-1 bg-black/50 justify-end">
//                 <MotiView
//                     from={{ translateY: 500 }} animate={{ translateY: 0 }}
//                     className="bg-surface rounded-t-3xl p-6 h-[70%]"
//                 >
//                     {/* Header */}
//                     <View className="flex-row justify-between items-center mb-6">
//                         <Text className="text-2xl font-bold text-text-main">Edit Medicine</Text>
//                         <View className='flex-row gap-8 items-end'>
//                             <TouchableOpacity onPress={onDelete} className="bg-red-500 p-2 rounded-full">
//                                 <Trash size={32} color="#ffffff" />
//                             </TouchableOpacity>
//                             <TouchableOpacity onPress={onClose} className="bg-slate-100 p-2 rounded-full">
//                                 <X size={32} color="#64748B" />
//                             </TouchableOpacity>
//                         </View>
//                     </View>

//                     <ScrollView showsVerticalScrollIndicator={false}>
//                         {/* 1. Name */}
//                         <View className="mb-6">
//                             <Text className="text-text-muted font-bold text-xs uppercase mb-2">Medicine Name</Text>
//                             <TextInput
//                                 value={name} onChangeText={setName}
//                                 className="bg-background p-4 rounded-xl text-lg font-bold border border-slate-200"
//                             />
//                         </View>

//                         {/* 2. Stock Control */}
//                         <View className="mb-6">
//                             <Text className="text-text-muted font-bold text-xs uppercase mb-2">Stock Level</Text>
//                             <View className="flex-row items-center gap-4">
//                                 <TouchableOpacity onPress={() => setStock((p) => Math.max(0, parseInt(p) - 1).toString())} className="bg-slate-100 p-3 rounded-xl">
//                                     <Minus color="#0F172A" />
//                                 </TouchableOpacity>
//                                 <TextInput
//                                     value={stock} onChangeText={setStock} keyboardType="numeric"
//                                     className="bg-background p-4 rounded-xl text-xl font-bold text-center w-24 border border-slate-200"
//                                 />
//                                 <TouchableOpacity onPress={() => setStock((p) => (parseInt(p) + 1).toString())} className="bg-slate-100 p-3 rounded-xl">
//                                     <Plus color="#0F172A" />
//                                 </TouchableOpacity>
//                             </View>
//                         </View>

//                         {/* 3. Time Slots */}
//                         <View className="mb-8">
//                             <Text className="text-text-muted font-bold text-xs uppercase mb-2">Schedule</Text>
//                             {timeSlots.map((time, index) => (
//                                 <View key={index} className="flex-row items-center mb-3">
//                                     <View className="bg-blue-50 p-3 rounded-xl mr-3">
//                                         <Clock size={20} color="#0EA5E9" />
//                                     </View>

//                                     {/* Date Picker Trigger */}
//                                     {Platform.OS === 'android' && (
//                                         <TouchableOpacity
//                                             onPress={() => setShowPickerIndex(index)}
//                                             className="flex-1 bg-background p-3 rounded-xl border border-slate-200"
//                                         >
//                                             <Text className="font-bold text-lg">
//                                                 {VoiceService.formatTime({ time })}                                            </Text>
//                                         </TouchableOpacity>
//                                     )}

//                                     {(Platform.OS === 'ios' || showPickerIndex === index) && (
//                                         <DateTimePicker
//                                             value={time}
//                                             mode="time"
//                                             themeVariant='light'
//                                             display={Platform.OS === 'ios' ? 'compact' : 'default'}
//                                             onChange={(e, d) => handleTimeChange(e, d, index)}
//                                             style={{ flex: 1, borderRadius: 12 }}
//                                         />
//                                     )}
//                                     <TouchableOpacity
//                                         onPress={() => { VoiceService.speakDual(`Dose at ${VoiceService.formatTime({ time })}.`, `दवाई का वक़्त ${VoiceService.getUrduTimePhrase({ time })}`); }}
//                                         className='ml-4 self-center bg-slate-100 p-2 rounded-full'
//                                     >
//                                         <Volume2 size={24} color="#0EA5E9" />
//                                     </TouchableOpacity>
//                                 </View>
//                             ))}
//                         </View>
//                     </ScrollView>

//                     {/* Footer */}
//                     <TouchableOpacity onPress={handleSave} className="bg-primary py-4 rounded-2xl flex-row items-center justify-center shadow-lg shadow-blue-500/30 mb-6">
//                         <Save color="white" size={24} className="mr-2" />
//                         <Text className="text-white font-bold text-xl">Save Changes</Text>
//                     </TouchableOpacity>
//                 </MotiView>
//             </View>
//         </Modal>
//     );
// }

import React, { useState, useEffect } from 'react';
import { View, Modal, TouchableOpacity, TextInput, ScrollView, Platform } from 'react-native';
import LocalizedText from './LocalizedText';
import { MotiView } from 'moti';
import { X, Save, Clock, Minus, Plus, Trash, Volume2 } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useStore, Medicine } from '@/store/useStore';
import { VoiceService } from '@/services/VoiceService';
import { useAlertStore } from '@/store/alertStore';
import { useLocalization } from '@/utils/useLocalization';

interface Props {
    visible: boolean;
    med: Medicine | null;
    onClose: () => void;
}

export default function EditMedicineModal({ visible, med, onClose }: Props) {
    const { t, getDualTTS } = useLocalization();
    const updateMedicine = useStore(state => state.updateMedicine);
    const removeMedicine = useStore(state => state.removeMedicine);

    const { showAlert } = useAlertStore();

    // Local Form State
    const [stock, setStock] = useState('');
    const [name, setName] = useState('');
    const [timeSlots, setTimeSlots] = useState<Date[]>([]);
    const [showPickerIndex, setShowPickerIndex] = useState<number | null>(null);

    useEffect(() => {
        if (med) {
            setName(med.name);
            setStock(med.stock.toString());
            // Convert string times back to Date objects for the picker
            const dates = med.timeSlots.map(t => {
                const d = new Date();
                const match = t.match(/(\d+):(\d+)\s?(AM|PM)?/i);
                if (match) {
                    let hours = parseInt(match[1], 10);
                    const minutes = parseInt(match[2], 10);
                    const period = match[3]?.toUpperCase();
                    if (period === 'PM' && hours < 12) hours += 12;
                    if (period === 'AM' && hours === 12) hours = 0;
                    d.setHours(hours, minutes, 0, 0);
                }
                return d;
            });
            setTimeSlots(dates);
        }
    }, [med]);

    const onDelete = () => {
        showAlert({
            title: t('delete_medicine'),
            message: t('delete_medicine_question'),
            type: "error",
            confirmText: t('delete'),
            onConfirm: () => {
                removeMedicine(med!.id);
                onClose();
            },
            cancelText: t('cancel'),
            onCancel: () => { },
        })
    }

    const handleSave = () => {
        if (!med) return;
        const formattedTimes = timeSlots.map(d => VoiceService.formatTime({ time: d }));
        updateMedicine(med.id, {
            name,
            stock: parseInt(stock) || 0,
            timeSlots: formattedTimes
        });
        onClose();
    };

    const handleTimeChange = (event: any, selectedDate?: Date, index: number = 0) => {
        if (Platform.OS === 'android') setShowPickerIndex(null);
        if (selectedDate) {
            const newSlots = [...timeSlots];
            newSlots[index] = selectedDate;
            setTimeSlots(newSlots);
        }
    };

    if (!visible || !med) return null;

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View className="flex-1 bg-black/60 justify-end">
                <MotiView
                    from={{ translateY: 500 }} animate={{ translateY: 0 }}
                    className="bg-surface dark:bg-dark-surface rounded-3xl p-6 h-[80%] border border-border dark:border-dark-border"
                >
                    {/* Header */}
                    <View className="flex-row justify-between items-center mb-6">
                        <LocalizedText className="text-2xl font-bold text-text-main dark:text-dark-text-main">{t('edit_medicine')}</LocalizedText>
                        <View className='flex-row gap-4 items-center'>
                            <TouchableOpacity onPress={onDelete} className="bg-error/20 p-3 rounded-full">
                                <Trash size={24} color="#FB7185" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={onClose} className="bg-surface-highlight dark:bg-dark-surface-highlight p-3 rounded-full border border-border/60 dark:border-dark-border/60">
                                <X size={24} color="#94A3B8" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* 1. Name */}
                        <View className="mb-6">
                            <LocalizedText className="text-text-muted dark:text-dark-text-muted font-bold text-xs uppercase mb-2">{t('medicine_name')}</LocalizedText>
                            <TextInput
                                value={name} onChangeText={setName}
                                className="bg-background dark:bg-dark-background p-4 rounded-xl text-lg font-bold border border-border dark:border-dark-border text-text-main dark:text-dark-text-main"
                                placeholderTextColor="#94A3B8"
                            />
                        </View>

                        {/* 2. Stock Control */}
                        <View className="mb-6">
                            <LocalizedText className="text-text-muted dark:text-dark-text-muted font-bold text-xs uppercase mb-2">{t('stock_level')}</LocalizedText>
                            <View className="flex-row items-center gap-4">
                                <TouchableOpacity onPress={() => setStock((p) => Math.max(0, parseInt(p) - 1).toString())} className="bg-surface-highlight dark:bg-dark-surface-highlight p-3 rounded-xl border border-border dark:border-dark-border">
                                    <Minus color="#0EA5E9" />
                                </TouchableOpacity>
                                <TextInput
                                    value={stock} onChangeText={setStock} keyboardType="numeric"
                                    className="bg-background dark:bg-dark-background p-4 rounded-xl text-xl font-bold text-center w-24 border border-border dark:border-dark-border text-text-main dark:text-dark-text-main"
                                    placeholderTextColor="#94A3B8"
                                />
                                <TouchableOpacity onPress={() => setStock((p) => (parseInt(p) + 1).toString())} className="bg-surface-highlight dark:bg-dark-surface-highlight p-3 rounded-xl border border-border dark:border-dark-border">
                                    <Plus color="#0EA5E9" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* 3. Time Slots */}
                        <View className="mb-8">
                            <LocalizedText className="text-text-muted dark:text-dark-text-muted font-bold text-xs uppercase mb-2">{t('schedule')}</LocalizedText>
                            {timeSlots.map((time, index) => (
                                <View key={index} className="flex-row items-center mb-3">
                                    <View className="bg-primary/10 dark:bg-dark-primary/20 p-3 rounded-xl mr-3">
                                        <Clock size={20} color="#0EA5E9" />
                                    </View>

                                    {/* Android Date Picker Trigger */}
                                    {Platform.OS === 'android' && (
                                        <TouchableOpacity
                                            onPress={() => setShowPickerIndex(index)}
                                            className="flex-1 bg-background dark:bg-dark-background p-3 rounded-xl border border-border dark:border-dark-border"
                                        >
                                            <LocalizedText className="font-bold text-lg text-text-main dark:text-dark-text-main">
                                                {VoiceService.formatTime({ time })}
                                            </LocalizedText>
                                        </TouchableOpacity>
                                    )}

                                    {/* iOS / Active Android Picker */}
                                    {(Platform.OS === 'ios' || showPickerIndex === index) && (
                                        <DateTimePicker
                                            value={time}
                                            mode="time"
                                            display={Platform.OS === 'ios' ? 'compact' : 'default'}
                                            onChange={(e, d) => handleTimeChange(e, d, index)}
                                            style={{ flex: 1 }}
                                        />
                                    )}

                                    <TouchableOpacity
                                        onPress={() => { VoiceService.speakDual(`Dose at ${VoiceService.formatTime({ time })}.`, `दवाई का वक़्त ${VoiceService.getUrduTimePhrase({ time })}`); }}
                                        className='ml-4 self-center bg-surface-highlight dark:bg-dark-surface-highlight p-2 rounded-full border border-border/60 dark:border-dark-border/60'
                                    >
                                        <Volume2 size={24} color="#0EA5E9" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </ScrollView>

                    {/* Footer */}
                    <TouchableOpacity onPress={handleSave} className="bg-primary py-4 rounded-2xl flex-row items-center justify-center gap-2 shadow-lg shadow-primary/30 mb-6">
                        <Save color="white" size={24} />
                        <LocalizedText className="text-white font-bold text-xl">{t('save_changes')}</LocalizedText>
                    </TouchableOpacity>
                </MotiView>
            </View>
        </Modal>
    );
}