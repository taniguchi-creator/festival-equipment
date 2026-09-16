import { INITIAL_EQUIPMENT, INITIAL_CLASSES } from './seedData';

const KEYS = {
  USER: 'kcs_festival_current_user',
  EQUIPMENT: 'kcs_festival_equipment_list',
  CLASSES: 'kcs_festival_classes_list',
  APPLICATIONS: 'kcs_festival_applications',
  SENT_EMAILS: 'kcs_festival_sent_emails',
};

// Seed initial storage if empty
export const initStorage = () => {
  if (!localStorage.getItem(KEYS.EQUIPMENT)) {
    localStorage.setItem(KEYS.EQUIPMENT, JSON.stringify(INITIAL_EQUIPMENT));
  }
  if (!localStorage.getItem(KEYS.CLASSES)) {
    localStorage.setItem(KEYS.CLASSES, JSON.stringify(INITIAL_CLASSES));
  }
  if (!localStorage.getItem(KEYS.APPLICATIONS)) {
    // Demo seed applications
    const demoApps = [
      {
        id: 'APP-1001',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        userName: '大分 太郎',
        userClass: 'S1A (システム開発科 1年)',
        userEmail: 'oita.t@kcs-oita.ac.jp',
        purpose: '学園祭オープニングステージおよびゲームブース設営',
        startDate: '2026-10-24 09:00',
        endDate: '2026-10-24 17:00',
        status: 'pending', // pending, approved, rejected
        items: [
          { id: 4, name: 'ホットプレート', quantity: 1, unit: '個' },
          { id: 14, name: 'ビンゴカード', quantity: 20, unit: '枚' }
        ]
      }
    ];
    localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(demoApps));
  }
  if (!localStorage.getItem(KEYS.SENT_EMAILS)) {
    localStorage.setItem(KEYS.SENT_EMAILS, JSON.stringify([]));
  }
};

// --- Auth Services ---
export const getCurrentUser = () => {
  const data = localStorage.getItem(KEYS.USER);
  return data ? JSON.parse(data) : null;
};

export const setCurrentUser = (user) => {
  if (!user) {
    localStorage.removeItem(KEYS.USER);
  } else {
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
  }
};

export const loginUser = (email, password) => {
  // Admin credentials check
  if (email.trim().toLowerCase() === 'admin@kcs.ac.jp' || email.trim() === 'admin') {
    const adminUser = {
      id: 'usr_admin',
      name: '学園祭 実行委員会 (管理者)',
      email: 'admin@kcs.ac.jp',
      className: '教職員・実行委員会',
      isAdmin: true,
    };
    setCurrentUser(adminUser);
    return { success: true, user: adminUser };
  }

  // General user login simulation
  const user = {
    id: 'usr_' + Date.now(),
    name: email.split('@')[0] || '一般学生',
    email: email,
    className: 'S1A (システム開発科 1年)',
    isAdmin: false,
  };
  setCurrentUser(user);
  return { success: true, user };
};

export const signupUser = ({ name, className, email, password }) => {
  const user = {
    id: 'usr_' + Date.now(),
    name,
    className,
    email,
    isAdmin: email.trim().toLowerCase() === 'admin@kcs.ac.jp',
  };
  setCurrentUser(user);
  return { success: true, user };
};

// --- Equipment Services ---
export const getEquipmentList = () => {
  initStorage();
  return JSON.parse(localStorage.getItem(KEYS.EQUIPMENT) || '[]');
};

export const saveEquipmentList = (list) => {
  localStorage.setItem(KEYS.EQUIPMENT, JSON.stringify(list));
};

export const resetEquipmentToSeed = () => {
  localStorage.setItem(KEYS.EQUIPMENT, JSON.stringify(INITIAL_EQUIPMENT));
  return INITIAL_EQUIPMENT;
};

export const addEquipmentItem = (item) => {
  const list = getEquipmentList();
  const newItem = {
    ...item,
    id: Date.now(),
    stock: parseInt(item.stock, 10) || 1,
  };
  list.unshift(newItem);
  saveEquipmentList(list);
  return list;
};

export const updateEquipmentItem = (updatedItem) => {
  const list = getEquipmentList();
  const idx = list.findIndex(i => i.id === updatedItem.id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...updatedItem, stock: parseInt(updatedItem.stock, 10) };
    saveEquipmentList(list);
  }
  return list;
};

export const deleteEquipmentItem = (id) => {
  const list = getEquipmentList().filter(i => i.id !== id);
  saveEquipmentList(list);
  return list;
};

// --- Class Master Services ---
export const getClassList = () => {
  initStorage();
  return JSON.parse(localStorage.getItem(KEYS.CLASSES) || '[]');
};

export const addClassItem = (className) => {
  const classes = getClassList();
  if (!classes.includes(className)) {
    classes.push(className);
    localStorage.setItem(KEYS.CLASSES, JSON.stringify(classes));
  }
  return classes;
};

export const deleteClassItem = (className) => {
  const classes = getClassList().filter(c => c !== className);
  localStorage.setItem(KEYS.CLASSES, JSON.stringify(classes));
  return classes;
};

// --- Applications Services ---
export const getApplications = () => {
  initStorage();
  return JSON.parse(localStorage.getItem(KEYS.APPLICATIONS) || '[]');
};

export const createApplication = ({ user, items, purpose, startDate, endDate }) => {
  const apps = getApplications();
  const newApp = {
    id: 'APP-' + Math.floor(1000 + Math.random() * 9000),
    createdAt: new Date().toISOString(),
    userName: user.name,
    userClass: user.className,
    userEmail: user.email,
    purpose,
    startDate,
    endDate,
    status: 'pending',
    items: items.map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      unit: item.unit
    }))
  };
  apps.unshift(newApp);
  localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(apps));
  return newApp;
};

export const approveApplication = (appId) => {
  const apps = getApplications();
  const equipment = getEquipmentList();
  
  const appIndex = apps.findIndex(a => a.id === appId);
  if (appIndex === -1) return { success: false, message: '申請が見つかりません' };

  const app = apps[appIndex];
  
  // Decrease stock for each item in the approved application
  app.items.forEach(requestedItem => {
    const eq = equipment.find(e => e.id === requestedItem.id);
    if (eq) {
      eq.stock = Math.max(0, eq.stock - requestedItem.quantity);
    }
  });

  saveEquipmentList(equipment);

  // Update app status
  app.status = 'approved';
  app.processedAt = new Date().toISOString();
  localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(apps));

  // Generate automated email notification
  const emailNotification = {
    id: 'mail_' + Date.now(),
    to: app.userEmail,
    recipientName: app.userName,
    subject: `【KCS学園祭備品管理】貸出申請が承認されました (${app.id})`,
    body: `
${app.userClass} ${app.userName} 様

KCS大分情報専門学校 学園祭備品貸出管理システムです。
ご申請いただいた以下の備品貸出が【承認】されました。

■ 申請番号: ${app.id}
■ 貸出期間: ${app.startDate} ～ ${app.endDate}
■ 使用目的: ${app.purpose}

【承認された備品一覧】
${app.items.map(i => `・${i.name} : ${i.quantity} ${i.unit}`).join('\n')}

学園祭当日は、指定された日時・場所にて安全に注意して受取・ご返却をお願いいたします。
    `.trim(),
    sentAt: new Date().toISOString(),
    type: 'approved'
  };

  addSentEmail(emailNotification);

  return { success: true, app, email: emailNotification };
};

export const rejectApplication = (appId, reason = '') => {
  const apps = getApplications();
  const appIndex = apps.findIndex(a => a.id === appId);
  if (appIndex === -1) return { success: false, message: '申請が見つかりません' };

  const app = apps[appIndex];
  app.status = 'rejected';
  app.rejectReason = reason || '在庫・使用計画等の都合により棄却されました。';
  app.processedAt = new Date().toISOString();
  localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(apps));

  // Generate automated rejection email notification
  const emailNotification = {
    id: 'mail_' + Date.now(),
    to: app.userEmail,
    recipientName: app.userName,
    subject: `【KCS学園祭備品管理】貸出申請結果のご連絡 (${app.id})`,
    body: `
${app.userClass} ${app.userName} 様

KCS大分情報専門学校 学園祭備品貸出管理システムです。
ご申請いただいた以下の備品貸出につきまして、誠に恐れ入りますが【棄却】となりました。

■ 申請番号: ${app.id}
■ 理由: ${app.rejectReason}

【対象の申請備品】
${app.items.map(i => `・${i.name} : ${i.quantity} ${i.unit}`).join('\n')}

ご不明な点がございましたら、学園祭実行委員会までお問い合わせください。
    `.trim(),
    sentAt: new Date().toISOString(),
    type: 'rejected'
  };

  addSentEmail(emailNotification);

  return { success: true, app, email: emailNotification };
};

export const getSentEmails = () => {
  initStorage();
  return JSON.parse(localStorage.getItem(KEYS.SENT_EMAILS) || '[]');
};

export const addSentEmail = (emailObj) => {
  const emails = getSentEmails();
  emails.unshift(emailObj);
  localStorage.setItem(KEYS.SENT_EMAILS, JSON.stringify(emails));
};
