import { TestBed } from '@angular/core/testing';
import { IBook } from 'src/app/core/models/book';
import { NotificationBellComponent } from './notification-bell.component';
import { NotifyAction } from 'src/app/core/models/notifyAction.enum';

// Testing of AddBookComponent
describe('#checkIfOpen(INotification), checkIfRequest(INotification), checkIfStartReading(INotification)', () => {
  let notificationBellComponent: NotificationBellComponent;

  beforeEach(() => {
    // Configures testing app module
    TestBed.configureTestingModule({
      providers: [NotificationBellComponent],
    });

    // Instantaites NotificationBellComponent
    notificationBellComponent = new NotificationBellComponent(
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    );
  });

  // Test case 1
  it('should return true because Notify Action is open', () => {
    const action: NotifyAction = NotifyAction.Open;

    const res = notificationBellComponent.checkIfOpen(action);

    expect(res).toBeTrue();
  });

  // Test case 2
  it('should return false because Notify Action is not open', () => {
    const action: NotifyAction = NotifyAction.Request;

    const res = notificationBellComponent.checkIfOpen(action);

    expect(res).toBeFalse();
  });

  // Test case 3
  it('should return true because Notify Action is request', () => {
    const action: NotifyAction = NotifyAction.Request;

    const res = notificationBellComponent.checkIfRequest(action);

    expect(res).toBeTrue();
  });

  // Test case 4
  it('should return true because Notify Action is not request', () => {
    const action: NotifyAction = NotifyAction.Open;

    const res = notificationBellComponent.checkIfRequest(action);

    expect(res).toBeFalse();
  });

  // Test case 5
  it('should return true because Notify Action is open', () => {
    const action: NotifyAction = NotifyAction.StartReading;

    const res = notificationBellComponent.checkIfStartReading(action);

    expect(res).toBeTrue();
  });

  // Test case 6
  it('should return true because Notify Action is open', () => {
    const action: NotifyAction = NotifyAction.Open;

    const res = notificationBellComponent.checkIfStartReading(action);

    expect(res).toBeFalse();
  });
});
