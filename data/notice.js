import dbConnect from '../utils/dbConnect';
import Notice from '../models/notice';

// ERRORS: ERN001 - ERN002
export async function getNotice() {
  let notice;

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('INTERNAL ERROR: ERN001');
  }

  try {
    notice = await Notice.findOne().sort('-createdDate');
  } catch (err) {
    if (err) {
      throw new Error('INTERNAL ERROR: ERN002');
    }
  }

  return notice;
}

export async function getNoticeJSON() {
  let notice = await getNotice();
  return JSON.stringify(notice);
}

// ERRORS: ERN001 - ERN002
export async function getCurrentNotice() {
  let notice;

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('INTERNAL ERROR: ERN001');
  }

  try {
    const today = new Date();
    notice = await Notice.findOne(
      { startDate: { $lte: today }, endDate: { $gte: today } },
      'text'
    ).sort('-createdDate');
  } catch (err) {
    if (err) {
      throw new Error('INTERNAL ERROR: ERN002');
    }
  }

  return notice;
}

// ERRORS: ERN003
export async function postNotice(notice) {
  const newNotice = new Notice({
    text: notice.text,
    startDate: notice.startDate,
    endDate: notice.endDate,
  });

  try {
    var created = newNotice.save();
    return created;
  } catch (err) {
    console.log(err);
    if (err) {
      throw new Error('INTERNAL ERROR: ERN003');
    }
  }

  console.log(notice);
  return notice;
}
