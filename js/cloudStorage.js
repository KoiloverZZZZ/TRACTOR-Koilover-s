
const SUPABASE_URL = 'https://irepaotouogkzobmwuno.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyZXBhb3RvdW9na3pvYm13dW5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0Mjk0MDksImV4cCI6MjA3NTAwNTQwOX0.T1MVu0kJ4r2TMVNnOWDECGRB7j0zPR_V3vdQxO_gsKs';

class CloudStorage {
    constructor() {
        this.url = SUPABASE_URL;
        this.key = SUPABASE_ANON_KEY;
        this.bucketName = 'koilover';
    }

    async uploadFile(file) {
        try {
            const fileName = `wheel_${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
            
            console.log('Начинаем загрузку файла:', fileName);
            console.log('Размер файла:', file.size);
            console.log('Тип файла:', file.type);
            
            const uploadUrl = `${this.url}/storage/v1/object/${this.bucketName}/${fileName}`;
            
            console.log('URL для загрузки:', uploadUrl);

            const response = await fetch(uploadUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.key}`,
                    'apikey': this.key,
                },
                body: file  
            });

            console.log('Статус ответа:', response.status);
            console.log('Заголовки ответа:', response.headers);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Ошибка ответа:', errorText);
                
                if (response.status === 401) {
                    throw new Error('Ошибка аутентификации. Проверьте API ключ.');
                } else if (response.status === 403) {
                    throw new Error('Доступ запрещен. Настройте политики RLS в Supabase Storage.');
                } else if (response.status === 400) {
                    throw new Error('Неверный запрос. Проверьте параметры загрузки.');
                } else {
                    throw new Error(`Ошибка загрузки: ${response.status} ${response.statusText}`);
                }
            }

            const result = await response.json();
            console.log('Успешная загрузка:', result);
            
            const publicUrl = `${this.url}/storage/v1/object/public/${this.bucketName}/${fileName}`;
            console.log('Публичный URL:', publicUrl);
            
            return publicUrl;
            
        } catch (error) {
            console.error('Полная ошибка загрузки:', error);
            throw error;
        }
    }

    async uploadFileAlternative(file) {
        console.log('Используем демо-режим загрузки');
        
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                setTimeout(() => {
                    const demoUrl = e.target.result;
                    console.log('Демо URL создан');
                    resolve(demoUrl);
                }, 1500);
            };
            reader.readAsDataURL(file);
        });
    }
}

export const cloudStorage = new CloudStorage();