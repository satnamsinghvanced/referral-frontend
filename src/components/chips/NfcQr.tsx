import React from 'react';
import { Chip } from '@heroui/react';
import { FiWifi } from 'react-icons/fi';

interface NfcQrProps {
    label: string
}

const NfcQr = ({ label }: NfcQrProps) => {
    return (
        <Chip size="sm" className="px-0.5 py-0 rounded-md bg-primary-100 text-primary-800 gap-1 text-xs uppercase">
            {label}
        </Chip>
    );
};

export default NfcQr;
