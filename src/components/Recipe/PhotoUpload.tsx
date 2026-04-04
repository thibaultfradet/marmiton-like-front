import { useRef, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import API_URL from '@/utils/apiUrl';

interface PhotoUploadProps {
  currentPhotoUrl?: string | null;
  onFileChange: (file: File | null) => void;
  deleteChecked?: boolean;
  onDeleteChange?: (checked: boolean) => void;
  isEdit?: boolean;
}

export default function PhotoUpload({
  currentPhotoUrl,
  onFileChange,
  deleteChecked = false,
  onDeleteChange,
  isEdit = false,
}: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setPreview(URL.createObjectURL(file));
      onFileChange(file);
    }
  };

  const clearFile = () => {
    setPreview(null);
    onFileChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const displayUrl = preview ?? (currentPhotoUrl ? `${API_URL}${currentPhotoUrl}` : null);

  return (
    <div className="space-y-3">
      <div
        onClick={() => !deleteChecked && inputRef.current?.click()}
        className={cn(
          'relative flex items-center justify-center rounded-xl border-2 border-dashed transition-colors overflow-hidden',
          deleteChecked ? 'cursor-not-allowed opacity-50 border-border' : 'cursor-pointer border-border hover:border-primary',
          displayUrl ? 'aspect-video' : 'aspect-16/7',
        )}
      >
        {displayUrl && !deleteChecked ? (
          <>
            <img src={displayUrl} alt="Aperçu" className="w-full h-full object-cover" />
            {preview && (
              <Button
                type="button"
                variant="secondary"
                size="icon"
                onClick={(e) => { e.stopPropagation(); clearFile(); }}
                className="absolute top-2 right-2 h-7 w-7"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground p-6">
            <ImagePlus className="h-8 w-8" />
            <p className="text-sm font-medium">Cliquer pour ajouter une photo</p>
            <p className="text-xs">PNG, JPG — max 5 Mo</p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />

      {isEdit && currentPhotoUrl && (
        <div className="flex items-center gap-2">
          <Checkbox
            id="deletePhoto"
            checked={deleteChecked}
            onCheckedChange={(v) => {
              onDeleteChange?.(!!v);
              if (v) clearFile();
            }}
          />
          <Label htmlFor="deletePhoto" className="text-sm font-normal text-muted-foreground cursor-pointer">
            Supprimer la photo actuelle
          </Label>
        </div>
      )}
    </div>
  );
}
