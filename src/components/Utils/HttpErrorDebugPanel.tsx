import { Button } from '@heroui/react';
import { LuShield } from 'react-icons/lu';

const HttpErrorDebugPanel = () => {

    const onErrorDebuggingClick = () => {
        alert("Debug HTTP errors Clicked");
    };

    return (
        <Button isIconOnly={true} variant="bordered" className="border-1 hover:bg-foreground/10 h-9 w-12" onPress={onErrorDebuggingClick} size="sm">
            <LuShield />
        </Button>
    )
}

export default HttpErrorDebugPanel