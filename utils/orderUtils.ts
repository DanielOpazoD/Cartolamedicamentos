import { Injectable, Inhaler, Medication, MedicationCategory } from '../types';

export type LogicalOrderKey =
    | 'cardiovascular'
    | 'diabetes'
    | 'insulinas'
    | 'glp1'
    | 'otros'
    | 'inhaladores';

const LOGICAL_ORDER_MAP: Record<LogicalOrderKey, number> = {
    cardiovascular: 0,
    diabetes: 1,
    insulinas: 2,
    glp1: 3,
    otros: 4,
    inhaladores: 5,
};

export const LOGICAL_LABELS: Record<LogicalOrderKey, string> = {
    cardiovascular: 'Cardiovascular / Hipertensión',
    diabetes: 'Diabetes',
    insulinas: 'Insulinas',
    glp1: 'Agonistas de GLP-1',
    otros: 'Otros',
    inhaladores: 'Inhaladores',
};

export const medicationCategoryToKey: Record<MedicationCategory, LogicalOrderKey> = {
    [MedicationCategory.CARDIOVASCULAR]: 'cardiovascular',
    [MedicationCategory.DIABETES]: 'diabetes',
    [MedicationCategory.OTHERS]: 'otros',
};

export const getMedicationLogicalKey = (med: Medication): LogicalOrderKey => {
    return medicationCategoryToKey[med.category] ?? 'otros';
};

export const getInjectableLogicalKey = (inj: Injectable): LogicalOrderKey => {
    const typeLower = inj.type.toLowerCase();
    if (typeLower.includes('insulina')) {
        return 'insulinas';
    }
    if (typeLower.includes('semaglutide') || typeLower.includes('liraglutide') || typeLower.includes('glp')) {
        return 'glp1';
    }
    return 'otros';
};

export const getInhalerLogicalKey = (): LogicalOrderKey => 'inhaladores';

const compareByLogicalOrder = (aKey: LogicalOrderKey, bKey: LogicalOrderKey) => {
    return LOGICAL_ORDER_MAP[aKey] - LOGICAL_ORDER_MAP[bKey];
};

export const sortMedicationsByLogicalOrder = (meds: Medication[]): Medication[] => {
    return [...meds].sort((a, b) => {
        const keyCompare = compareByLogicalOrder(getMedicationLogicalKey(a), getMedicationLogicalKey(b));
        if (keyCompare !== 0) return keyCompare;
        return a.name.localeCompare(b.name, 'es');
    });
};

export const sortInjectablesByLogicalOrder = (injectables: Injectable[]): Injectable[] => {
    return [...injectables].sort((a, b) => {
        const keyCompare = compareByLogicalOrder(getInjectableLogicalKey(a), getInjectableLogicalKey(b));
        if (keyCompare !== 0) return keyCompare;
        return a.type.localeCompare(b.type, 'es');
    });
};

export const sortInhalersByName = (inhalers: Inhaler[]): Inhaler[] => {
    return [...inhalers].sort((a, b) => a.name.localeCompare(b.name, 'es'));
};

export const reorderList = <T,>(list: T[], startIndex: number, endIndex: number): T[] => {
    const result = [...list];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};
