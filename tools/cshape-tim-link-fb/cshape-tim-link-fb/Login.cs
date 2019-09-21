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
    public partial class Login : Form
    {
        public Login()
        {
            InitializeComponent();
        }

        private void btn_login_Click(object sender, EventArgs e)
        {
            Open();
        }

        private void Open()
        {
            this.Hide();

            MainProfile bp = new MainProfile();
            bp.ShowDialog();

            this.Show();
        }
    }
}
