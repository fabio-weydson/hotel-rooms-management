import React from 'react';
import { Button } from './button';
import { Upload } from 'lucide-react';

const UploadFoto = ({ title, optional = false, fotoUrl, onSaveFoto }) => {

    const handleFileChange = (e) => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                console.log(`Arquivo selecionado: ${file.name}`);
                onSaveFoto({ name: file.name, data: file });
                
                reader.readAsDataURL(file);
            }
        };
        fileInput.click();
    }
        
    

    return (
        <div className="flex flex-col items-center mb-4">
            <div className="flex justify-between items-center w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {`${title} ${optional ? '(opcional)' : ''}: `}
                </label>
                <Button
                    variant="outline"
                    className="cursor-pointer"
                    onClick={handleFileChange}
                >
                    <Upload className="w-4 h-4 mr-2" /> Selecionar Foto
                </Button>
            </div>
            {fotoUrl && (
                <div className="mt-2">
                    <img src={`https://awhyqgjzekcuwysymtsl.supabase.co/storage/v1/object/public/vistorias/${fotoUrl}`} alt="Foto selecionada" className="mt-2 max-w-50" />
                </div>
            )}
        </div>
    )
}

export { UploadFoto };