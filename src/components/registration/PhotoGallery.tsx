import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';

const MAX_PHOTOS = 20;

interface Photo {
  id: string;
  url: string;
  file: File;
}

interface PhotoGalleryProps {
  photos: Photo[];
  coverPhotoId: string | null;
  onPhotosChange: (photos: Photo[]) => void;
  onCoverPhotoChange: (photoId: string | null) => void;
}

export default function PhotoGallery({ 
  photos, 
  coverPhotoId, 
  onPhotosChange, 
  onCoverPhotoChange 
}: PhotoGalleryProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const remainingSlots = MAX_PHOTOS - photos.length;
    const filesToAdd = Array.from(files).slice(0, remainingSlots);

    const newPhotos: Photo[] = filesToAdd.map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      url: URL.createObjectURL(file),
      file
    }));

    const updatedPhotos = [...photos, ...newPhotos];
    onPhotosChange(updatedPhotos);

    if (updatedPhotos.length === 1 && !coverPhotoId) {
      onCoverPhotoChange(updatedPhotos[0].id);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDelete = (photoId: string) => {
    const updatedPhotos = photos.filter(p => p.id !== photoId);
    onPhotosChange(updatedPhotos);

    if (coverPhotoId === photoId) {
      onCoverPhotoChange(updatedPhotos.length > 0 ? updatedPhotos[0].id : null);
    }
  };

  const handleSetCover = (photoId: string) => {
    onCoverPhotoChange(photoId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Фотографии портфолио</Label>
        <Badge variant="secondary">
          {photos.length} / {MAX_PHOTOS}
        </Badge>
      </div>

      {photos.length < MAX_PHOTOS && (
        <div
          className={cn(
            'border-2 border-dashed rounded-lg p-8 transition-all duration-200',
            isDragging 
              ? 'border-primary bg-primary/5 scale-[1.02]' 
              : 'border-muted-foreground/30 hover:border-primary/50'
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon name="Upload" size={32} className="text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium mb-1">
                Перетащите фотографии сюда
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                или нажмите кнопку ниже
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Icon name="ImagePlus" size={16} className="mr-2" />
                Выбрать файлы
              </Button>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
        </div>
      )}

      {photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {photos.map(photo => (
            <div
              key={photo.id}
              className={cn(
                'relative group rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-[1.02]',
                coverPhotoId === photo.id 
                  ? 'border-primary shadow-lg' 
                  : 'border-muted/50'
              )}
            >
              <div className="aspect-square relative">
                <img
                  src={photo.url}
                  alt="Portfolio"
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                
                {coverPhotoId === photo.id && (
                  <Badge className="absolute top-2 left-2 bg-primary/90 backdrop-blur-sm">
                    <Icon name="Star" size={12} className="mr-1" />
                    Обложка
                  </Badge>
                )}

                <div className="absolute bottom-2 left-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {coverPhotoId !== photo.id && (
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="flex-1"
                      onClick={() => handleSetCover(photo.id)}
                    >
                      <Icon name="Star" size={14} className="mr-1" />
                      Обложка
                    </Button>
                  )}
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    className={coverPhotoId === photo.id ? 'flex-1' : ''}
                    onClick={() => handleDelete(photo.id)}
                  >
                    <Icon name="Trash2" size={14} className={coverPhotoId === photo.id ? 'mr-1' : ''} />
                    {coverPhotoId === photo.id && 'Удалить'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {photos.length === 0 && (
        <div className="text-center py-8 text-muted-foreground text-sm">
          <Icon name="ImageOff" size={48} className="mx-auto mb-3 opacity-30" />
          <p>Фотографии не загружены</p>
          <p className="text-xs mt-1">Добавьте хотя бы одну фотографию для портфолио</p>
        </div>
      )}
    </div>
  );
}
