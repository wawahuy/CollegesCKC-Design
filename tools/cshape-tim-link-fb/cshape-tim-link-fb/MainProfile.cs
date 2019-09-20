using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace cshape_tim_link_fb
{
    public partial class MainProfile : Form
    {
        Form m_editProfileBox, m_browserProfileBox;

        public MainProfile()
        {
            InitializeComponent();
        }

        private void MainProfile_Load(object sender, EventArgs e)
        {
            m_editProfileBox = new EditProfileBox();
            m_editProfileBox.MdiParent = this;
            m_editProfileBox.Show();

            m_browserProfileBox = new BrowserProfileBox();
            m_browserProfileBox.MdiParent = this;
            m_browserProfileBox.Show();

            m_editProfileBox.Dock = DockStyle.Left;
            m_browserProfileBox.Dock = DockStyle.Right;
            m_browserProfileBox.Anchor = AnchorStyles.Left | AnchorStyles.Right | AnchorStyles.Top | AnchorStyles.Bottom;
        }

    }
}
