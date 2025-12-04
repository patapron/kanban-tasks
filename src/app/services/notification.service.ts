import { Injectable } from '@angular/core';
import { LocalNotifications, ScheduleOptions } from '@capacitor/local-notifications';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor() {
    this.requestPermissions();
  }

  async requestPermissions(): Promise<void> {
    try {
      const result = await LocalNotifications.requestPermissions();
      if (result.display === 'granted') {
        console.log('Notification permissions granted');
      }
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
    }
  }

  async scheduleTaskNotification(task: Task): Promise<void> {
    if (!task.dueDate || !task.notificationEnabled) {
      return;
    }

    try {
      // Programar notificación 1 hora antes de la fecha de vencimiento
      const notificationTime = new Date(task.dueDate);
      notificationTime.setHours(notificationTime.getHours() - 1);

      // Solo programar si la fecha es futura
      if (notificationTime.getTime() > Date.now()) {
        const options: ScheduleOptions = {
          notifications: [
            {
              id: this.getNotificationId(task.id),
              title: 'Recordatorio de tarea',
              body: `${task.title} - Vence en 1 hora`,
              schedule: { at: notificationTime },
              sound: undefined,
              attachments: undefined,
              actionTypeId: '',
              extra: {
                taskId: task.id
              }
            }
          ]
        };

        await LocalNotifications.schedule(options);
      }
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }

  async cancelTaskNotification(taskId: string): Promise<void> {
    try {
      await LocalNotifications.cancel({
        notifications: [{ id: this.getNotificationId(taskId) }]
      });
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  }

  async sendImmediateNotification(title: string, body: string): Promise<void> {
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            id: Math.floor(Math.random() * 100000),
            title,
            body,
            schedule: { at: new Date(Date.now() + 1000) },
            sound: undefined,
            attachments: undefined,
            actionTypeId: '',
            extra: null
          }
        ]
      });
    } catch (error) {
      console.error('Error sending immediate notification:', error);
    }
  }

  private getNotificationId(taskId: string): number {
    // Convertir el taskId a un número único
    let hash = 0;
    for (let i = 0; i < taskId.length; i++) {
      const char = taskId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
}
