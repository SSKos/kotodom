// server/services/AnimalService.js
import {Animal} from '../models/Animal.js';

class AnimalService {
    // Create a new animal entry
    async createAnimal(animalData) {
        const latestAnimal = await Animal.findOne().sort({ id: -1 });
        const nextId = latestAnimal ? String(parseInt(latestAnimal.id) + 1).padStart(4, '0') : '0001';
        const animal = new Animal({ id: nextId, ...animalData });
        return await animal.save();
    }

    // Update an existing animal entry by ID
    async updateAnimal(id, updateData) {
        return await Animal.findOneAndUpdate({ id }, updateData, { new: true });
    }

    // Delete an animal entry by ID
    async deleteAnimal(id) {
        const animal = await Animal.findOneAndDelete({ id });
        if (animal) {
            await this.updateIdsAfterDeletion(id);
        }
        return animal;
    }

    // Update IDs after deletion to maintain sequential order
    async updateIdsAfterDeletion(deletedId) {
        const animals = await Animal.find({ id: { $gt: deletedId } }).sort({ id: 1 });
        for (const animal of animals) {
            animal.id = String(parseInt(animal._id) - 1).padStart(4, '0');
            await animal.save();
        }
    }
}

export default new AnimalService();