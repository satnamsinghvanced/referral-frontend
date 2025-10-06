import { IoQrCodeOutline } from 'react-icons/io5'
import Button from '../../components/ui/Button'
import { FaQrcode } from 'react-icons/fa'
import QrCode from '../../components/ui/QrCode'
import { useState } from 'react'
import Input from '../../components/ui/Input'

const NfcQrTracking = () => {
    const [showQr, setShowQr] = useState(false)

    const toggleQr = () => {
        setShowQr(!showQr)
    }
    return (
        <div className="w-full min-h-80 h-full flex gap-2">
            <div className="border w-full border-primary/20 p-4 rounded-xl bg-background flex flex-col justify-between">
                <div>
                    <h6 className="text-sm flex  items-center gap-2"><QrCode className="text-primary" /> QR & NFC Code Generato</h6>
                    <p className="text-xs mt-1 font-light text-foreground-700">Generate personalized QR codes and NFC tags for General Practice</p>
                </div>
                {!showQr ?
                    <>
                        <QrCode className={`h-16 w-16 self-center text-foreground-500`} />
                        <div className="flex flex-col gap-3 items-center justify-center text-xs text-foreground-600">
                            <p>Generate a personalized QR code for this referrer</p>
                            <Button buttonType="primary" className={'w-1/2'} onPress={toggleQr}>
                                Generate QR Code
                            </Button>
                        </div>
                    </>
                    :
                    <div className="flex flex-col gap-3 items-center  text-xs text-foreground-600 border pt-6 w-full">
                        <img
                            src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https%3A%2F%2Fpracticemarketer.ai%2Freferral%2Fgeneral" alt="QR"
                            className='h-1/2 aspect-square'
                        />
                        <div className='flex justify-end items-end gap-2 w-full'>
                            <Input
                                label='Referral Landing Page URL'
                                value={'https://practicemarketer.ai/referral/general'}
                                labelPlacement='outside'
                                className='w-full !px-0 '
                            />
                            <Button size='sm' buttonType='custom' className={`border-primary-100`}> ihi</Button>
                        </div>
                        <Button buttonType="primary" className={'w-1/2 bg-transparent text-foreground-700 text-sm'} onPress={toggleQr}>
                            Generate New Code
                        </Button>
                    </div>
                }
            </div>
            <div className="border w-full border-primary/20 p-4 rounded-xl bg-background">
                <h6 className="text-sm">Tracking Analytics</h6>
                <div className="flex flex-col gap-3 mt-4  rounded-md ">
                    <div className="flex justify-between text-xs p-4 rounded-lg bg-primary-50/50">
                        <div>Total Scans Today</div>
                        <div><span className="px-1.5 py-0.5 bg-green-200 rounded-sm">23</span></div>
                    </div>
                    <div className="flex justify-between text-xs p-4 rounded-lg bg-primary-50/50">
                        <div>Active QR Codes</div>
                        <div><span className="px-1.5 py-0.5 bg-cyan-200 rounded-sm">67</span></div>
                    </div>
                    <div className="flex justify-between text-xs p-4 rounded-lg bg-primary-50/50">
                        <div>NFC Taps</div>
                        <div><span className="px-1.5 py-0.5 bg-blue-200 rounded-sm">18 </span></div>
                    </div>
                    <div className="flex justify-between text-xs p-4 rounded-lg bg-primary-50/50">
                        <div>Conversion Rate</div>
                        <div><span className="px-1.5 py-0.5 bg-indigo-200 rounded-sm">78%</span></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NfcQrTracking