import { PropsWithChildren } from 'react';
import { useTheme } from '@/src/context/ThemeProvider';

export default function ContainerTheme({ children }: PropsWithChildren) {
    const { theme } = useTheme();
    return (
        <div data-theme={theme}>
            {children}
        </div>
    )
}