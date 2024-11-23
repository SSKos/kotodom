import express from 'express';
import multer from 'multer';
import path from 'path';
import {Animal} from '../models/Animal.js';
import fs from 'fs';

const router = express.Router();
const tempDir = path.join(process.cwd(), 'client/src/assets/img/cats/temp');

// Helper to ensure directory exists
const ensureDirectoryExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
    }
};

// Helper to get photo path
const getPhotoPath = (animalId, filename) => path.join(process.cwd(), `client/src/assets/img/cats/${animalId}`, filename);

// Temporary storage configuration
const tempStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        ensureDirectoryExists(tempDir);
        cb(null, tempDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Keep original filename
    }
});

const upload = multer({ storage: tempStorage, limits: { fileSize: 2 * 1024 * 1024 } });

// Move files from temp to target directory
const moveFiles = (files, targetDir) => {
    files.forEach(file => {
        const tempPath = file.path;
        const targetPath = path.join(targetDir, file.originalname);

        fs.copyFileSync(tempPath, targetPath); // Copy file
        fs.unlinkSync(tempPath); // Delete temp file
        console.log(`Moved file from ${tempPath} to ${targetPath}`);
    });
};

// Routes for CRUD operations

// Route to get an animal by ID
router.get('/animals/:id', async (req, res) => {
    try {
        const animal = await Animal.findById(req.params.id);
        if (!animal) return res.status(404).json({ message: 'Animal not found' });
        res.json(animal);
    } catch (error) {
        console.error('Error fetching animal:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to get all animals
router.get('/animals', async (req, res) => {
    try {
        const animals = await Animal.find();
        res.json(animals);
    } catch (error) {
        console.error('Error fetching animals:', error);
        res.status(500).json({ message: 'Error fetching animals' });
    }
});

// Route to create a new animal
router.post('/animals/:id/photos', upload.array('photos'), async (req, res) => {
    const animalId = req.params.id;

    try {
        const animal = await Animal.findById(animalId);
        if (!animal) return res.status(404).json({ message: 'Animal not found' });

        const targetDir = path.join(process.cwd(), `client/src/assets/img/cats/${animalId}`);
        ensureDirectoryExists(targetDir);

        if (req.files && req.files.length > 0) {
            moveFiles(req.files, targetDir);

            const newPhotos = req.files.map(file => ({
                filename: file.originalname,
                fullPath: `/assets/img/cats/${animalId}/${file.originalname}`,
            }));

            animal.photos.push(...newPhotos);
            await animal.save();

            res.status(201).json({ message: 'Photos successfully uploaded', photos: animal.photos });
        } else {
            res.status(400).json({ message: 'No photos provided' });
        }
    } catch (error) {
        console.error('Error uploading photos:', error);
        res.status(500).json({ message: 'Error uploading photos', error: error.message });
    }
});

// Route to create a new animal
router.post('/animals', async (req, res) => {
    try {
        const newAnimal = new Animal(req.body); // Создаём новый объект животного с данными из запроса
        await newAnimal.save(); // Сохраняем новый объект в базе данных
        res.status(201).json(newAnimal); // возвращаем созданный объект с кодом 201 Created
    } catch (error) {
        console.error('Ошибка создания нового животного:', error);
        res.status(500).json({ message: 'Ошибка создания нового животного', error: error.message });
    }
});

// Route to replace a photo
router.put('/animals/:id/replacePhoto', upload.single('newPhoto'), async (req, res) => {
    try {
        const animalId = req.params.id;
        const photoId = req.body.photoId;
        const newPhoto = req.file;

        const animal = await Animal.findById(animalId);
        if (!animal) return res.status(404).json({ message: 'Animal not found' });

        const targetDir = path.join(process.cwd(), `client/src/assets/img/cats/${animalId}`);
        ensureDirectoryExists(targetDir);

        if (newPhoto) {
            const photoIndex = animal.photos.findIndex(photo => photo._id.toString() === photoId);
            if (photoIndex === -1) return res.status(404).json({ message: 'Photo not found' });

            // Delete old photo file
            const oldPhotoPath = getPhotoPath(animalId, animal.photos[photoIndex].filename);
            if (fs.existsSync(oldPhotoPath)) {
                fs.unlinkSync(oldPhotoPath);
            }

            // Replace with new photo
            moveFiles([newPhoto], targetDir);
            animal.photos[photoIndex].filename = newPhoto.originalname;

            await animal.save();
            res.json({ message: 'Photo replaced successfully', photo: animal.photos[photoIndex] });
        } else {
            res.status(400).json({ message: 'No photo provided' });
        }
    } catch (error) {
        console.error('Error replacing photo:', error);
        res.status(500).json({ message: 'Error replacing photo', error: error.message });
    }
});

// Route to update animal details
router.put('/animals/:id', upload.array('photos'), async (req, res) => {
    try {
        const animalId = req.params.id;
        const targetDir = path.join(process.cwd(), `client/src/assets/img/cats/${animalId}`);
        ensureDirectoryExists(targetDir);

        let newPhotos = [];
        if (req.files && req.files.length > 0) {
            moveFiles(req.files, targetDir);
            newPhotos = req.files.map(file => ({ filename: file.originalname }));
        }

        const updateData = { ...req.body };
        delete updateData.photos; // Remove photos from req.body

        const updatedAnimal = await Animal.findByIdAndUpdate(
            animalId,
            {
                $set: updateData, // Update other data
                $push: { photos: { $each: newPhotos } } // Add new photos
            },
            { new: true }
        );

        res.json({ message: 'Animal updated successfully', animal: updatedAnimal });
    } catch (error) {
        console.error('Error updating animal:', error);
        res.status(500).json({ message: 'Error updating animal', error: error.message });
    }
});

// Route to delete a photo
router.delete('/photos/:animalId/:photoId', async (req, res) => {
    const { animalId, photoId } = req.params;

    try {
        const animal = await Animal.findById(animalId);
        if (!animal) return res.status(404).json({ message: 'Animal not found' });

        const photoIndex = animal.photos.findIndex(photo => photo._id.toString() === photoId);
        if (photoIndex === -1) return res.status(404).json({ message: 'Photo not found' });

        const photoPath = path.join(process.cwd(), `client/src/assets/img/cats/${animalId}/${animal.photos[photoIndex].filename}`);
        if (fs.existsSync(photoPath)) {
            fs.unlinkSync(photoPath);
        }

        // Update the database
        animal.photos = animal.photos.filter(photo => photo._id.toString() !== photoId);
        await animal.save();

        res.json({ message: 'Фото успешно удалено.', photos: animal.photos });
    } catch (error) {
        console.error('Error deleting photo:', error);
        res.status(500).json({ message: 'Ошибка удаления фото.', error: error.message });
    }
});

router.delete('/animals/:id', async (req, res) => {
    try {
        const animalId = req.params.id;
        const animal = await Animal.findById(animalId);

        if (!animal) {
            return res.status(404).json({message: 'Animal not found'});
        }

        const targetDir = path.join(process.cwd(), `client/src/assets/img/cats/${animal._id}`);

        if (fs.existsSync(targetDir)) {
            fs.rmSync(targetDir, {recursive: true, force: true});
            console.log(`Deleted directory: ${targetDir}`);
        }

        await Animal.findByIdAndDelete(animalId);
        console.log(`Deleted animal with id: ${animalId}`);
        res.json({message: 'Animal deleted successfully'}); // Send a 200 OK response

    } catch (error) {
        console.error('Error deleting animal:', error);
        res.status(500).json({message: 'Error deleting animal', error: error.message}); // Send 500 error with details
    }
});


export default router;